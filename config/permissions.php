<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Role de Desenvolvedor
    |--------------------------------------------------------------------------
    |
    | Esta role terá acesso total ao sistema, ignorando todas as verificações
    | de permissão. Útil para desenvolvimento e manutenção.
    |
    */
    'developer_role' => env('PERMISSION_DEVELOPER_ROLE', 'developer'),

    /*
    |--------------------------------------------------------------------------
    | Role de Administrador
    |--------------------------------------------------------------------------
    |
    | acesso administrativo ao sistema.
    |
    */
    'admin_role' => env('PERMISSION_ADMIN_ROLE', 'admin'),

    /*
    |--------------------------------------------------------------------------
    | Grupos do Sistema
    |--------------------------------------------------------------------------
    |
    | Lista dos grupos disponíveis no sistema para organização das permissões.
    |
    */
    'groups' => [
        'ACL' => 'Controle de Acesso',
        'Users' => 'Usuários',
        'Compras' => 'Compras',
        'Vendas' => 'Vendas',
        'Estoque' => 'Estoque',
        'Financeiro' => 'Financeiro',
        'Relatorios' => 'Relatórios',
    ],

    /*
    |--------------------------------------------------------------------------
    | Ações Padrão
    |--------------------------------------------------------------------------
    |
    | Ações padrão que serão criadas para cada módulo.
    |
    */
    'default_actions' => [
        'view' => 'Visualizar',
        'create' => 'Criar',
        'edit' => 'Editar',
        'delete' => 'Excluir',
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache de Permissões
    |--------------------------------------------------------------------------
    |
    | Configurações para cache das permissões para melhor performance.
    |
    */
    'cache' => [
        'enabled' => env('PERMISSION_CACHE_ENABLED', true),
        'ttl' => env('PERMISSION_CACHE_TTL', 3600), // 1 hora
        'key_prefix' => 'permissions_',
    ],
];
