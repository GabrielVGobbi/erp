# Sistema de Permissões ACL - ERP

Este módulo implementa um sistema completo de controle de acesso baseado em roles e permissões para o sistema ERP.

## Estrutura do Módulo

```
app/Modules/ACL/
├── Models/
│   ├── Permission.php      # Modelo de permissões
│   └── Role.php           # Modelo de roles
├── Traits/
│   └── HasPermissionsTrait.php  # Trait para usuários
├── Helpers/
│   └── PermissionHelper.php     # Helper para facilitar uso
├── Examples/
│   └── PermissionUsageExample.php  # Exemplos de uso
└── README.md
```

## Instalação e Configuração

### 1. Migrations
As migrations já foram executadas e criaram as seguintes tabelas:
- `permissions` - Armazena as permissões
- `roles` - Armazena as roles
- `users_permissions` - Relacionamento usuário-permissão
- `users_roles` - Relacionamento usuário-role
- `roles_permissions` - Relacionamento role-permissão

### 2. Seeder
Execute o seeder para popular dados iniciais:
```bash
php artisan db:seed --class=PermissionsSeeder
```

### 3. Configuração
O arquivo `config/permissions.php` contém as configurações do sistema.

## Como Usar

### 1. Em Controllers

```php
public function store(Request $request)
{
    // Verificar permissão usando can()
    if (!$request->user()->can('compras.create')) {
        abort(403, 'Sem permissão para criar compras');
    }
    
    // Ou usando middleware no construtor
    $this->middleware(['can:compras.view'], ['only' => ['index']]);
}
```

### 2. Em Rotas

```php
// Proteger com role
Route::middleware(['role:admin'])->group(function () {
    Route::get('/admin', 'AdminController@index');
});

// Proteger com role e permissão
Route::middleware(['role:admin,users.view'])->group(function () {
    Route::resource('users', UserController::class);
});

// Proteger rota específica
Route::get('/compras', 'ComprasController@index')
    ->middleware('can:compras.view');
```

### 3. Em Views Blade

```blade
{{-- Verificar role --}}
@role('admin')
    <a href="/admin">Painel Admin</a>
@endrole

{{-- Verificar permissão --}}
@permission('compras.create')
    <button>Nova Compra</button>
@endpermission

{{-- Usando can do Laravel --}}
@can('compras.edit')
    <button>Editar</button>
@endcan
```

### 4. Gerenciamento de Permissões

```php
use App\Modules\ACL\Helpers\PermissionHelper;

// Atribuir role a usuário
PermissionHelper::assignRoleToUser($user, 'admin');

// Atribuir permissão direta
PermissionHelper::assignPermissionToUser($user, 'compras.create');

// Verificar permissão
if (PermissionHelper::userHasPermission($user, 'compras.view')) {
    // Usuário pode visualizar compras
}

// Usando métodos do trait
$user->givePermissionsTo('compras.create', 'compras.edit');
$user->hasRole('admin');
$user->can('compras.create');
```

## Comandos Artisan

### Criar Permissões para Módulo
```bash
# Criar permissões padrão (view, create, edit, delete)
php artisan permissions:create-module Vendas

# Criar com ações específicas
php artisan permissions:create-module Relatorios --actions=view --actions=export --actions=print
```

## Estrutura de Permissões

### Nomenclatura
As permissões seguem o padrão: `{modulo}.{acao}`

Exemplos:
- `compras.view` - Visualizar compras
- `compras.create` - Criar compras
- `users.edit` - Editar usuários
- `relatorios.export` - Exportar relatórios

### Roles Padrão
- `dev` - Desenvolvedor (acesso total)
- `admin` - Administrador
- `user` - Usuário comum

## Middleware Disponível

### RoleMiddleware
```php
// Verificar apenas role
Route::middleware(['role:admin'])->group(function () {
    // rotas
});

// Verificar role e permissão
Route::middleware(['role:admin,users.view'])->group(function () {
    // rotas
});
```

## Blade Directives

### @role / @endrole
```blade
@role('admin')
    Conteúdo apenas para admins
@endrole
```

### @permission / @endpermission
```blade
@permission('compras.create')
    <button>Nova Compra</button>
@endpermission
```

## Exemplos Práticos

### 1. Proteger Controller Completo
```php
class ComprasController extends Controller
{
    public function __construct()
    {
        $this->middleware(['can:compras.view'], ['only' => ['index', 'show']]);
        $this->middleware(['can:compras.create'], ['only' => ['create', 'store']]);
        $this->middleware(['can:compras.edit'], ['only' => ['edit', 'update']]);
        $this->middleware(['can:compras.delete'], ['only' => ['destroy']]);
    }
}
```

### 2. Menu Dinâmico
```blade
<nav>
    @can('compras.view')
        <a href="/compras">Compras</a>
    @endcan
    
    @can('users.view')
        <a href="/users">Usuários</a>
    @endcan
    
    @role('admin')
        <a href="/admin">Administração</a>
    @endrole
</nav>
```

### 3. Criar Novo Módulo
```php
// 1. Criar permissões
PermissionHelper::createModulePermissions('Vendas');

// 2. Atribuir à role admin
$adminRole = Role::where('slug', 'admin')->first();
$permissions = Permission::where('module', 'Vendas')->get();
$adminRole->permissions()->syncWithoutDetaching($permissions->pluck('id'));

// 3. Proteger rotas
Route::middleware(['can:vendas.view'])->group(function () {
    Route::resource('vendas', VendasController::class);
});
```

## Configuração de Ambiente

Adicione ao `.env`:
```env
PERMISSION_DEVELOPER_ROLE=dev
PERMISSION_ADMIN_ROLE=admin
PERMISSION_CACHE_ENABLED=true
PERMISSION_CACHE_TTL=3600
```

## Troubleshooting

### Erro: "Cannot declare class Permission"
- Verifique se não há conflito de nomes de classe
- Certifique-se de que os namespaces estão corretos

### Permissões não funcionando
- Verifique se o PermissionsServiceProvider está registrado
- Execute `php artisan config:cache` após mudanças
- Verifique se as migrations foram executadas

### Cache de permissões
- Para limpar cache: `php artisan cache:clear`
- Desabilitar cache: `PERMISSION_CACHE_ENABLED=false`

## Próximos Passos

1. Implementar interface web para gerenciar roles e permissões
2. Adicionar auditoria de permissões
3. Implementar permissões por organização/filial
4. Criar relatórios de acesso
