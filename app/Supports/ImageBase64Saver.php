<?php

namespace App\Supports;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageBase64Saver
{
    protected static $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    public static function saveBase64Image(string $base64Image, string $directory = 'uploads/images', string $disk = 'public', bool $convertToWebp = true): string|null
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $matches)) {
            $originalExtension = strtolower($matches[1]);

            if (!in_array($originalExtension, self::$allowedTypes)) {
                throw new \Exception("Formato de imagem não permitido: .$originalExtension");
            }

            $base64Data = substr($base64Image, strpos($base64Image, ',') + 1);
            $decodedData = base64_decode($base64Data);

            if ($decodedData === false) {
                throw new \Exception("Erro ao decodificar a imagem base64.");
            }

            // Decidir a extensão final
            $finalExtension = $convertToWebp && in_array($originalExtension, ['png', 'jpg', 'jpeg']) ? 'webp' : $originalExtension;
            
            $filename = now()->format('Ymd_His') . '_' . Str::uuid() . '.' . $finalExtension;
            $path = $directory . '/' . now()->format('Y/m/d');

            // Converter para WebP se necessário
            if ($convertToWebp && $originalExtension !== 'webp' && in_array($originalExtension, ['png', 'jpg', 'jpeg'])) {
                $convertedData = self::convertToWebp($decodedData, $originalExtension);
                if ($convertedData !== false) {
                    $decodedData = $convertedData;
                }
            }

            Storage::disk($disk)->put("$path/$filename", $decodedData);

            return Storage::disk($disk)->url("$path/$filename");
        }

        throw new \Exception("Formato base64 inválido.");
    }

    /**
     * Converte dados de imagem para formato WebP
     */
    private static function convertToWebp(string $imageData, string $sourceFormat): string|false
    {
        // Criar resource de imagem baseado no formato original
        $image = match ($sourceFormat) {
            'png' => imagecreatefromstring($imageData),
            'jpg', 'jpeg' => imagecreatefromstring($imageData),
            'gif' => imagecreatefromstring($imageData),
            default => false
        };

        if ($image === false) {
            return false;
        }

        // Preservar transparência para PNG
        if ($sourceFormat === 'png') {
            imagesavealpha($image, true);
            imagealphablending($image, false);
        }

        // Converter para WebP com qualidade alta
        ob_start();
        $success = imagewebp($image, null, 90); // 90% de qualidade
        $webpData = ob_get_contents();
        ob_end_clean();

        imagedestroy($image);

        return $success ? $webpData : false;
    }
}
