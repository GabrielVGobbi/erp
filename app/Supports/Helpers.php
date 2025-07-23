<?php

use App\Managers\Permissions\Models\ACL\Role;
use App\Managers\Shop\Models\Store;
use App\Models\Order;
use App\Supports\CEP;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Number;
use Illuminate\Validation\ValidationException;

/**
 * Makes translation fall back to specified value if definition does not exist
 *
 * @param string $key
 * @param null|string $fallback
 * @param null|string $locale
 * @param array|null $replace
 *
 * @return array|\Illuminate\Contracts\Translation\Translator|null|string
 */
function __trans($key = '', ?array $replace = [], ?string $fallback = null, ?string $locale = 'pt_BR')
{
    $keyM = __minusculo($key);

    if (\Illuminate\Support\Facades\Lang::has($keyM, $locale) && !empty($keyM)) {
        if (gettype(trans($keyM, $replace, $locale)) == 'array') {
            return trans($keyM, $replace, $locale)[0];
        }
        return trans($keyM, $replace, $locale);
    }

    return ltrim($key);
}

if (!function_exists('validateDateFormat')) {
    /**
     * Valida uma data conforme o formato esperado (ex: d/m/Y, m/Y etc).
     *
     * @param string $date   A data a ser validada (ex: '12/2025', '22/05/2025')
     * @param string $format O formato esperado (ex: 'm/Y', 'd/m/Y')
     * @return bool          true se válida e no formato correto, false se inválida
     */
    function validateDateFormat(string $date, string $format): bool
    {
        // Verifica se a data está vazia
        if (empty($date)) {
            return false;
        }

        // Cria um objeto DateTime a partir da data e formato fornecidos
        $dateObj = DateTime::createFromFormat($format, $date);

        // Verifica se a data foi criada com sucesso e se corresponde exatamente ao formato
        return $dateObj !== false && $dateObj->format($format) === $date;
    }
}

if (!function_exists('addToDate')) {
    /**
     * Adiciona dias, meses ou horas a uma data específica.
     *
     * @param string $date A data inicial (formato: 'Y-m-d H:i:s' ou 'Y-m-d').
     * @param string $type O tipo de incremento: 'dia', 'mes' ou 'hora'.
     * @param int $value O valor a ser adicionado.
     * @return string A nova data após o incremento, no formato 'Y-m-d H:i:s'.
     */
    function addToDate($date,  $value, $type = 'days',)
    {
        $date = Carbon::parse(str_replace('/', '-', $date));

        return match ($type) {
            'days' => $date->addDays($value)->format('d/m/Y H:i:s'),
            'month' => $date->addMonths($value)->format('d/m/Y H:i:s'),
            'hours' => $date->addHours($value)->format('d/m/Y H:i:s'),
            default => throw new InvalidArgumentException("Tipo de incremento inválido: use 'days', 'month' ou 'hours'."),
        };
    }
}

if (!function_exists('only_numbers')) {
    /**
     * Extrai apenas os números de uma string.
     *
     * @param string $string
     * @return string
     */
    function only_numbers($string)
    {
        if (empty($string)) {
            return 0;
        }

        return preg_replace('/\D/', '', $string);
    }
}

function uuid()
{
    return Str::uuid();
}

function slug($value, $separator = '_')
{
    return Str::slug(mb_strtolower($value, 'UTF-8'), $separator);
}

function str_random($value)
{
    return Str::random($value);
}

function tx_limit($text, $limit = 30)
{
    return Str::limit($text, $limit, '...');
}

function token($size = 10, $charsAlphabetic = true)
{
    $chars = "0123456789";
    if ($charsAlphabetic) {
        $chars .= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuwxyz';
        $chars .= date("Y-m-d H:i:s");
    } else {
        $chars .= date("H:i:s");
    }

    $randomString = '';
    for ($i = 0; $i < $size; $i = $i + 1) {
        $randomString .= $chars[mt_rand(0, strlen($chars) - 5)];
    }

    return substr(uniqid(((date('s') / 12) * 24) + mt_rand(1, 9999) . clear($randomString)), 0, $size);
}

function clear($variavel, $troca = "")
{
    return str_replace(['-', '.', '/', '_'], '', strtolower(preg_replace("/[^a-zA-Z0-9-]/", "$troca", strtr(utf8_decode(trim($variavel)), utf8_decode("áàãâéêíóôõúüñçÁÀÃÂÉÊÍÓÔÕÚÜÑÇ"), "aaaaeeiooouuncAAAAEEIOOOUUNC-"))));
}

/**
 * Convert the given number to its currency equivalent.
 *
 * @param  int|float  $number
 * @param  string  $in
 * @param  string|null  $locale
 * @return string|false
 */
function toCurrency($value, $in = "BRL", $locale = 'pt-BR')
{
    return Number::currency(($value), $in, $locale);
}

function __minusculo($text)
{
    return mb_strtolower($text ?? '', 'UTF-8');
}

function __maiusculo($text)
{
    return mb_strtoupper($text ?? '', 'UTF-8');
}

function __singular($text)
{
    return Str::singular($text);
}

function __plural($text)
{
    return Str::plural($text);
}

/**
 * Helper para redirecionar para a página anterior
 * com opção de fallback para uma rota específica
 *
 * @param string|null $fallback Rota ou URL de fallback caso a página anterior não esteja disponível
 * @return string
 */
function route_back($fallback = null)
{
    return url()->previous() ?: ($fallback ?: url('/'));
}

function titleCase($string)
{
    if (empty($string)) {
        return '';
    }

    $string = mb_strtolower($string, 'UTF-8');
    $explode = explode(" ", $string);
    $in = '';
    foreach ($explode as $str) {
        if (strlen($str) > 2) {
            $in .= mb_convert_case($str, MB_CASE_TITLE, "UTF-8") . ' ';
        } else {
            $in .= $str . ' ';
        }
    }
    return trim(ucfirst($in));
}

function valorToDec($valor)
{
    $money = preg_replace('/[\x{00A0}\x{202F}\s]/u', '', $valor); // remove espaços invisíveis
    $money = str_replace(['R$', '%'], '', $money);

    if (strpos($money, ',') !== false && strpos($money, '.') !== false) {
        if (strrpos($money, ',') > strrpos($money, '.')) {
            $money = str_replace('.', '', $money); // remove milhar
            $money = str_replace(',', '.', $money); // decimal vira ponto
        } else {
            $money = str_replace(',', '', $money); // remove milhar
        }
    } elseif (strpos($money, ',') !== false) {
        $money = str_replace('.', '', $money); // só por segurança
        $money = str_replace(',', '.', $money);
    } else {
        $money = str_replace(',', '', $money);
    }

    if (!is_numeric($money)) {
        throw ValidationException::withMessages(['Valor Numérico Informado é Inválido']);
    }

    return floatval($money);
}

function parseMoneyToDec($money)
{
    $numberFormatter = new \NumberFormatter('nl_NL', \NumberFormatter::DECIMAL);

    $money = str_replace(['R$', '%', ' '], '', preg_replace('/\xc2\xa0/', '', ltrim($money)));

    $money = $numberFormatter->parse($money);

    return Money::parseByDecimal($money, 'BRL')->getAmount();
}

function _log($modelName, Model $model, $causer, $logDescription = '', $attributes = [])
{
    activity($modelName)
        ->performedOn($model)
        ->causedBy($causer)
        ->withProperties($attributes)
        ->log($logDescription);
}

function validateDate($date, $format = 'd/m/Y')
{
    $d = \DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) == $date;
}

function clearNumberToSendWhats($number)
{
    return '55' . clear($number);
}


function validarCpfCnpj($value)
{
    // Remove caracteres não numéricos
    $value = preg_replace('/[^0-9]/', '', $value);

    // Valida o tamanho do CPF ou CNPJ
    if (strlen($value) === 11) {
        return validarCpf($value);
    } elseif (strlen($value) === 14) {
        return validarCnpj($value);
    }

    return false;
}

function validarCpf($cpf)
{
    if (app()->isLocal()) {
        return true;
    }

    // Rejeita números repetidos, como "111.111.111-11"
    if (preg_match('/(\d)\1{10}/', $cpf)) {
        return false;
    }

    // Calcula os dígitos verificadores
    for ($t = 9; $t < 11; $t++) {
        $d = 0;
        for ($c = 0; $c < $t; $c++) {
            $d += $cpf[$c] * (($t + 1) - $c);
        }
        $d = ((10 * $d) % 11) % 10;
        if ($cpf[$c] != $d) {
            return false;
        }
    }

    return true;
}

function validarCnpj($cnpj)
{
    // Rejeita números repetidos, como "11.111.111/1111-11"
    if (preg_match('/(\d)\1{13}/', $cnpj)) {
        return false;
    }

    // Pesos para o cálculo do primeiro e segundo dígito verificador
    $pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    $pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    // Calcula o primeiro dígito verificador
    $d1 = 0;
    for ($i = 0; $i < 12; $i++) {
        $d1 += $cnpj[$i] * $pesos1[$i];
    }
    $d1 = ($d1 % 11 < 2) ? 0 : 11 - ($d1 % 11);

    // Calcula o segundo dígito verificador
    $d2 = 0;
    for ($i = 0; $i < 13; $i++) {
        $d2 += $cnpj[$i] * $pesos2[$i];
    }
    $d2 = ($d2 % 11 < 2) ? 0 : 11 - ($d2 % 11);

    // Verifica os dígitos
    return $cnpj[12] == $d1 && $cnpj[13] == $d2;
}

function isAuthenticated()
{
    // Verifica se o usuário está autenticado via web ou sanctum
    return Auth::guard('web')->check() || Auth::guard('sanctum')->check();
}

function role($slug)
{
    return Role::where('slug', $slug)->first()->id;
}


function cep($cep)
{
    // Remove qualquer caractere não numérico
    $cep = preg_replace('/[^0-9]/', '', $cep);

    // Verifica se o CEP tem exatamente 8 dígitos
    if (strlen($cep) === 8) {
        return app(CEP::class)->getAddressByCep($cep);
    }

    return ['message' => 'CEP com formato inválido'];
}

function f_vyb($arq)
{
    return asset("vyb/$arq");
}

function getInitials(string $name): string
{
    // Divide o nome por espaços e pega a primeira letra de cada palavra
    $words = explode(' ', trim($name));
    $initials = array_map(fn($word) => strtoupper($word[0]), $words);

    // Retorna as iniciais concatenadas
    return __maiusculo(implode('', $initials));
}

function extrairNomeSobrenome($nomeCompleto)
{
    // Lista de palavras a serem ignoradas
    $excecoes = ['da', 'de', 'do', 'dos', 'das', 'e'];

    // Quebrando o nome em partes
    $partes = explode(' ', trim($nomeCompleto));

    // Filtrando as palavras válidas (ignorando preposições)
    $validos = array_filter($partes, function ($parte) use ($excecoes) {
        return !in_array(strtolower($parte), $excecoes);
    });

    // Reindexa o array para garantir os índices corretos
    $validos = array_values($validos);

    // Se não tiver ao menos 2 nomes válidos, retorna o original
    if (count($validos) < 2) {
        return $nomeCompleto;
    }

    // Pegando o primeiro e o último nome válido
    $primeiroNome = $validos[0];
    $ultimoNome = $validos[count($validos) - 1];

    return titleCase("$primeiroNome $ultimoNome");
}

function generateOrderToken()
{
    // escolhe aleatoriamente o tamanho entre 6 e 8
    $length = rand(6, 8);
    $token = '';

    // monta o token só com dígitos
    for ($i = 0; $i < $length; $i++) {
        $token .= random_int(0, 9);
    }

    // se já existir no banco, gera outro
    if (Order::where('token', $token)->exists()) {
        return generateOrderToken();
    }

    return $token;
}

function getStoreOfOwner()
{
    return Store::where('user_id', auth()->user()->id)->first() ?: throw ValidationException::withMessages([
        'message' => __('Store not found')
    ]);
}

function clearCreditCardNumber($variavel)
{
    return str_replace('.', '', $variavel);
}

function array_not_null($array = [])
{
    return collect($array)->filter(function ($request) {
        return is_string($request) && !empty($request) || is_array($request) && count($request);
    })->toArray();
}

function maskCpf($cpf)
{
    // Certifique-se que o CPF tem exatamente 11 dígitos, sem pontuação
    $cpf = preg_replace('/[^0-9]/', '', $cpf); // Remove tudo que não for número

    if (strlen($cpf) != 11) {
        return null; // Ou um valor padrão se o CPF não tiver o tamanho correto
    }

    // Aplicando a máscara
    $maskedCpf = '***.' . substr($cpf, 3, 3) . '.' . substr($cpf, 6, 3) . '.***';

    return $maskedCpf;
}

function cache_gateway()
{
    return app()->isProduction() ? 2 : 30;
}

if (!function_exists('format_document')) {
    function format_document(string $document): string
    {
        $onlyNumbers = preg_replace('/\D/', '', $document);

        if (strlen($onlyNumbers) === 11) {
            // CPF: 000.000.000-00
            return preg_replace(
                '/^(\d{3})(\d{3})(\d{3})(\d{2})$/',
                '$1.$2.$3-$4',
                $onlyNumbers
            );
        }

        if (strlen($onlyNumbers) === 14) {
            // CNPJ: 00.000.000/0000-00
            return preg_replace(
                '/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/',
                '$1.$2.$3/$4-$5',
                $onlyNumbers
            );
        }

        return $document; // Retorna sem formato se não for 11 ou 14 dígitos
    }
}
