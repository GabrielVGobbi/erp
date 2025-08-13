<?php

namespace App\Modules\Compras\Supports\Enums\Purchases;

use App\Supports\Enums\Concerns\GetsAttributes;

enum PurchaseRequisitionStatus: string
{
    use GetsAttributes;

    case DRAFT = 'draft';
    case CLOSED = 'closed';
    case UNDER_NEGOTIATION = 'under_negotiation';
    case CANCELED = 'canceled';
    case SUBMITTED_FOR_APPROVAL = 'submitted_for_approval';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';

    /**
     * Define as transições válidas de status
     */
    private const VALID_TRANSITIONS = [
        'draft' => ['submitted_for_approval', 'canceled'],
        'submitted_for_approval' => ['canceled',  'approved', 'rejected'],
        'approved' => ['under_negotiation', 'canceled'],
        'rejected' => ['draft'],
        'under_negotiation' => [ 'canceled'],
        'closed' => [],
        'canceled' => [],
    ];

    public static function getLabelTextByLabel($label): string
    {
        return match ($label) {
            'draft' => 'Rascunho',
            'closed' => 'Fechado',
            'under_negotiation' => 'Em Negociação',
            'canceled' => 'Cancelada',
            'submitted_for_approval' => 'Enviado para Aprovação',
            'approved' => 'Aprovado',
            'rejected' => 'Recusado',
            default => 'Desconhecido',
        };
    }

    public  function getLabelTextDefinitionStatus(): string
    {
        return match ($this) {
            self::DRAFT => 'Colocar em Rascunho',
            self::CLOSED => 'Fechado',
            self::UNDER_NEGOTIATION => 'Iniciar Negociação',
            self::CANCELED => 'Cancelar Pedido',
            self::SUBMITTED_FOR_APPROVAL => 'Enviar para Aprovação',
            self::APPROVED => 'Aprovar Requisição',
            self::REJECTED => 'Recusar Requisição',
        };
    }

    public function getLabelText(): string
    {
        return match ($this) {
            self::DRAFT => 'Rascunho',
            self::CLOSED => 'Fechado',
            self::UNDER_NEGOTIATION => 'Em Negociação',
            self::CANCELED => 'Cancelada',
            self::SUBMITTED_FOR_APPROVAL => 'Enviado para Aprovação',
            self::APPROVED => 'Aprovado',
            self::REJECTED => 'Recusado',
        };
    }

    public function getLabelColor(): string
    {
        return match ($this) {
            self::DRAFT => 'secondary',
            self::CLOSED => 'success',
            self::UNDER_NEGOTIATION => 'info',
            self::CANCELED => 'danger',
            self::SUBMITTED_FOR_APPROVAL => 'warning',
            self::APPROVED => 'success',
            self::REJECTED => 'danger',
        };
    }

    public function getIcon(): string
    {
        return match ($this) {
            self::DRAFT => 'fa-solid fa-pen-ruler',
            self::CLOSED => 'fa-solid fa-check',
            self::UNDER_NEGOTIATION => 'fa-solid fa-handshake',
            self::CANCELED => 'fa-solid fa-times',
            self::SUBMITTED_FOR_APPROVAL => 'fa-solid fa-paper-plane',
            self::APPROVED => 'fa-solid fa-thumbs-up',
            self::REJECTED => 'fa-solid fa-ban',
        };
    }

    /**
     * Verifica se pode transicionar para outro status
     */
    public function canTransitionTo(PurchaseRequisitionStatus $newStatus): bool
    {
        $allowedTransitions = self::VALID_TRANSITIONS[$this->value] ?? [];
        return in_array($newStatus->value, $allowedTransitions);
    }

    /**
     * Retorna os status disponíveis para transição
     */
    public function getAvailableTransitions(): array
    {
        $allowedTransitions = self::VALID_TRANSITIONS[$this->value] ?? [];

        return array_map(function ($statusValue) {
            $status = self::from($statusValue);
            return [
                'value' => $status->value,
                'label' => $status->getLabelTextDefinitionStatus(),
                'color' => $status->getLabelColor(),
            ];
        }, $allowedTransitions);
    }
}
