<?php

namespace App\Modules\Compras\Supports\Enums;

use App\Supports\Enums\Concerns\GetsAttributes;

enum PurchaseCategory: string
{
    use GetsAttributes;

    case MATERIAIS = 'materiais';
    case SERVICOS = 'servicos';
    case LOCACAO = 'locacao';

    public static function getLabelTextByLabel(string $label): string
    {
        return match ($label) {
            self::MATERIAIS->value => 'Compras de Materiais',
            self::SERVICOS->value => 'Serviços',
            self::LOCACAO->value => 'Locação',
            default => 'Desconhecido',
        };
    }

    public function getLabelText(): string
    {
        return match ($this) {
            self::MATERIAIS => 'Materiais',
            self::SERVICOS => 'Serviços',
            self::LOCACAO => 'Locação',
        };
    }

    public function getLabelColor(): string
    {
        return match ($this) {
            self::MATERIAIS => 'primary',
            self::SERVICOS => 'warning',
            self::LOCACAO => 'info',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::MATERIAIS => 'Aquisição de materiais e insumos necessários para a operação.',
            self::SERVICOS => 'Contratação de serviços de terceiros para apoio às atividades.',
            self::LOCACAO => 'Locação de equipamentos, espaços ou outros recursos temporários.',
        };
    }
}
