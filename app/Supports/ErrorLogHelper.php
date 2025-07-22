<?php

namespace App\Supports;

use App\Jobs\SendWhatsAppMessage;
use App\Models\ErrorLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Throwable;

class ErrorLogHelper
{
    public static function logError(
        Throwable $th,
        ?Request $request = null,
        ?string $context = null,
        bool $validationException = false,
        array $extraData = [],
    ): void {

        $errorDetails = [
            'message' => tx_limit($th->getMessage(), 1000),
            'file' => $th->getFile(),
            'line' => $th->getLine(),
            'function' => self::getFunctionName($th),
            'code' => $th->getCode(),
            'stack_trace' => $th->getTraceAsString(),
            'exception_class' => get_class($th),
            'timestamp' => now()->toDateTimeString(),
        ];

        // Informações do request, se disponível
        $requestDetails = null;
        if ($request) {
            $requestDetails = [
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'ip' => $request->ip(),
                'headers' => $request->headers->all(),
                'payload' => self::sanitizePayload($request->all()),
                'user_id' => Auth::check() ? Auth::id() : null,
            ];
        }

        // Montar log estruturado
        $logData = array_merge([
            'context' => $context ?? 'General Error',
            'error' => $errorDetails,
            'request' => $requestDetails,
        ], $extraData);

        // Log padrão
        Log::error($th->getMessage(), $logData);

        // Log customizado (pode ser Slack, Stack etc.)
        #Log::channel('stack')->error('Custom Error Log', $logData);

        // Notificação (via WhatsApp)
        #$phone = config('logging.notify_phone', null);
        #if ($phone) {
            #SendWhatsAppMessage::dispatch($phone, 'Erro capturado no sistema: ' . $th->getMessage());
        #}

        ErrorLog::create([
            'message' => $th->getMessage(),
            'exception_class' => get_class($th),
            'file' => $th->getFile(),
            'line' => $th->getLine(),
            'function' => self::getFunctionName($th),
            'code' => $th->getCode(),
            'stack_trace' => $th->getTraceAsString(),
            'context' => $context ?? 'General Error',
            'request' => $requestDetails,
            'extra' => $extraData,
        ]);

        if ($validationException) {
            Log::warning('Validation Exception', $logData);
            static::throwValidationException($th);
            return;
        }
    }

    /**
     * Extrai o nome da função onde o erro ocorreu
     */
    private static function getFunctionName(Throwable $th): ?string
    {
        $trace = $th->getTrace();
        return $trace[0]['function'] ?? null;
    }

    /**
     * Sanitiza dados sensíveis (recursivo)
     */
    private static function sanitizePayload(array $payload): array
    {
        $sensitiveKeys = ['password', 'password_confirmation', 'token', 'api_key'];

        $sanitized = [];
        foreach ($payload as $key => $value) {
            if (in_array(strtolower($key), $sensitiveKeys)) {
                $sanitized[$key] = '***SENSITIVE***';
            } elseif (is_array($value)) {
                $sanitized[$key] = self::sanitizePayload($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }

    /**
     * Lança uma ValidationException
     */
    public static function throwValidationException(Throwable $th): void
    {
        throw ValidationException::withMessages([
            'error' => $th->getMessage()
        ]);
    }
}
