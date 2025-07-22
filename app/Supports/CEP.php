<?php

namespace App\Supports;

use App\Exceptions\ApiResponseException;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Validation\ValidationException;

class CEP
{
    public function getAddressByCep($cep)
    {
        $client = new Client();

        $url = "https://viacep.com.br/ws/{$cep}/json/";

        try {
            $response = $client->request('GET', $url);

            return $this->handleErrors($response);
        } catch (\Exception $e) {
            throw  ValidationException::withMessages(['message' => 'CEP não encontrado']);
        }
    }

    protected function handleErrors($response): array
    {
        return match ($response->getStatusCode()) {
            200 => json_decode($response->getBody(), true, 512, JSON_THROW_ON_ERROR),
            201 => json_decode($response->getBody(), true, 512, JSON_THROW_ON_ERROR),
                #404 => abort('404'),
                #401, 500 => $this->errorResponse($response),
            default => throw new ApiResponseException($response)
        };
    }
}
