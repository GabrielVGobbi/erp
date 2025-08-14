<?php

namespace App\Modules\ACL\Examples;

use App\Models\User;
use App\Modules\ACL\Helpers\PermissionHelper;

/**
 * Exemplos de como usar o sistema de permissões
 */
class PermissionUsageExample
{
    public function exemploDeUso()
    {
        // Exemplo 1: Verificar permissão em um controller
        $this->exemploController();

        // Exemplo 2: Usar em middleware de rotas
        $this->exemploMiddleware();

        // Exemplo 3: Usar em views Blade
        $this->exemploView();

        // Exemplo 4: Atribuir roles e permissões
        $this->exemploAtribuicao();

        // Exemplo 5: Criar permissões para um novo módulo
        $this->exemploNovoModulo();
    }

    /**
     * Exemplo de uso em controllers
     */
    private function exemploController()
    {
        /*
        // Em um controller
        public function store(Request $request)
        {
            // Verificar se o usuário tem permissão
            if (!$request->user()->can('compras.create')) {
                abort(403, 'Você não tem permissão para criar compras.');
            }

            // Ou usando o helper
            if (!PermissionHelper::userHasPermission($request->user(), 'compras.create')) {
                abort(403, 'Você não tem permissão para criar compras.');
            }

            // Código para criar a compra...
        }

        public function __construct()
        {
            // Aplicar middleware em todo o controller
            $this->middleware(['can:compras.view'], ['only' => ['index', 'show']]);
            $this->middleware(['can:compras.create'], ['only' => ['create', 'store']]);
            $this->middleware(['can:compras.edit'], ['only' => ['edit', 'update']]);
            $this->middleware(['can:compras.delete'], ['only' => ['destroy']]);
        }
        */
    }

    /**
     * Exemplo de uso em middleware de rotas
     */
    private function exemploMiddleware()
    {
        /*
        // Em routes/web.php
        Route::middleware(['auth'])->group(function () {

            // Proteger rotas com role
            Route::middleware(['role:admin'])->group(function () {
                Route::get('/admin', 'AdminController@index');
            });

            // Proteger rotas com role e permissão
            Route::middleware(['role:admin,users.view'])->group(function () {
                Route::resource('users', UserController::class);
            });

            // Proteger rota específica
            Route::get('/compras', 'ComprasController@index')
                ->middleware('can:compras.view');
        });
        */
    }

    /**
     * Exemplo de uso em views Blade
     */
    private function exemploView()
    {
        /*
        <!-- Em uma view Blade -->

        <!-- Verificar role -->
        @role('admin')
            <a href="/admin">Painel Admin</a>
        @endrole

        <!-- Verificar permissão -->
        @permission('compras.create')
            <a href="/compras/create" class="btn btn-primary">Nova Compra</a>
        @endpermission

        <!-- Usando can do Laravel -->
        @can('compras.edit')
            <a href="/compras/{{ $compra->id }}/edit">Editar</a>
        @endcan

        <!-- Verificar múltiplas permissões -->
        @if(auth()->user()->can('compras.edit') || auth()->user()->can('compras.delete'))
            <div class="actions">
                @can('compras.edit')
                    <button>Editar</button>
                @endcan
                @can('compras.delete')
                    <button>Excluir</button>
                @endcan
            </div>
        @endif
        */
    }

    /**
     * Exemplo de atribuição de roles e permissões
     */
    private function exemploAtribuicao()
    {
        /*
        // Atribuir role a um usuário
        $user = User::find(1);
        PermissionHelper::assignRoleToUser($user, 'admin');

        // Atribuir permissão direta a um usuário
        PermissionHelper::assignPermissionToUser($user, 'compras.create');

        // Verificar se usuário tem role
        if (PermissionHelper::userHasRole($user, 'admin')) {
            // Usuário é admin
        }

        // Verificar se usuário tem permissão
        if (PermissionHelper::userHasPermission($user, 'compras.view')) {
            // Usuário pode visualizar compras
        }

        // Usando os métodos do trait diretamente
        $user->givePermissionsTo('compras.create', 'compras.edit');
        $user->withdrawPermissionsTo('compras.delete');

        if ($user->hasRole('admin')) {
            // Usuário é admin
        }

        if ($user->can('compras.create')) {
            // Usuário pode criar compras
        }
        */
    }

    /**
     * Exemplo de criação de permissões para um novo módulo
     */
    private function exemploNovoModulo()
    {
        /*
        // Criar permissões para um novo módulo "Vendas"
        PermissionHelper::createModulePermissions('Vendas');

        // Isso criará automaticamente:
        // - vendas.view
        // - vendas.create
        // - vendas.edit
        // - vendas.delete

        // Ou criar com ações customizadas
        PermissionHelper::createModulePermissions('Relatorios', [
            'view', 'export', 'print'
        ]);

        // Obter todas as permissões de um módulo
        $permissoesCompras = PermissionHelper::getModulePermissions('Compras');
        */
    }
}
