<?php

namespace App\Modules\ACL\Examples;

use App\Models\User;
use App\Modules\ACL\Models\Role;
use App\Modules\ACL\Models\Permission;
use App\Modules\ACL\Helpers\PermissionHelper;

/**
 * Exemplo de como testar o sistema de permissões
 *
 * Execute este código em um tinker ou controller de teste:
 * php artisan tinker
 * (new App\Modules\ACL\Examples\PermissionTestExample())->runTests();
 */
class PermissionTestExample
{
    public function runTests()
    {
        echo "=== TESTE DO SISTEMA DE PERMISSÕES ===\n\n";

        // 1. Criar usuário de teste
        $user = $this->createTestUser();

        // 2. Testar atribuição de roles
        $this->testRoleAssignment($user);

        // 3. Testar atribuição de permissões
        $this->testPermissionAssignment($user);

        // 4. Testar verificações de permissão
        $this->testPermissionChecks($user);

        // 5. Testar helper
        $this->testHelper($user);

        // 6. Testar criação de módulo
        $this->testModuleCreation();

        echo "\n=== TESTES CONCLUÍDOS ===\n";
    }

    private function createTestUser()
    {
        echo "1. Criando usuário de teste...\n";

        $user = User::firstOrCreate([
            'email' => 'teste@exemplo.com'
        ], [
            'name' => 'Usuário Teste',
            'password' => bcrypt('123456')
        ]);

        echo "   ✓ Usuário criado: {$user->name} ({$user->email})\n\n";

        return $user;
    }

    private function testRoleAssignment($user)
    {
        echo "2. Testando atribuição de roles...\n";

        // Limpar roles existentes
        $user->roles()->detach();

        // Atribuir role admin
        $adminRole = Role::where('slug', 'admin')->first();
        if ($adminRole) {
            $user->roles()->attach($adminRole);
            echo "   ✓ Role 'admin' atribuída\n";
        }

        // Verificar se tem a role
        $hasAdmin = $user->hasRole('admin');
        echo "   ✓ Verificação hasRole('admin'): " . ($hasAdmin ? 'SIM' : 'NÃO') . "\n";

        // Testar role que não tem
        $hasUser = $user->hasRole('user');
        echo "   ✓ Verificação hasRole('user'): " . ($hasUser ? 'SIM' : 'NÃO') . "\n\n";
    }

    private function testPermissionAssignment($user)
    {
        echo "3. Testando atribuição de permissões...\n";

        // Limpar permissões diretas
        $user->permissions()->detach();

        // Atribuir permissão direta
        $permission = Permission::where('slug', 'compras.create')->first();
        if ($permission) {
            $user->permissions()->attach($permission);
            echo "   ✓ Permissão 'compras.create' atribuída diretamente\n";
        }

        // Usar método do trait
        $user->givePermissionsTo('compras.edit');
        echo "   ✓ Permissão 'compras.edit' atribuída via trait\n\n";
    }

    private function testPermissionChecks($user)
    {
        echo "4. Testando verificações de permissão...\n";

        // Recarregar usuário para pegar relacionamentos
        $user = $user->fresh(['roles', 'permissions']);

        // Testar permissão direta
        $canCreate = $user->can('compras.create');
        echo "   ✓ can('compras.create'): " . ($canCreate ? 'SIM' : 'NÃO') . "\n";

        // Testar permissão via role (admin tem todas)
        $canView = $user->can('compras.view');
        echo "   ✓ can('compras.view') via role: " . ($canView ? 'SIM' : 'NÃO') . "\n";

        // Testar permissão que não tem
        $canDelete = $user->can('compras.delete');
        echo "   ✓ can('compras.delete'): " . ($canDelete ? 'SIM' : 'NÃO') . "\n";

        // Testar hasPermissionTo
        $permission = Permission::where('slug', 'compras.create')->first();
        if ($permission) {
            $hasPermission = $user->hasPermissionTo($permission);
            echo "   ✓ hasPermissionTo(compras.create): " . ($hasPermission ? 'SIM' : 'NÃO') . "\n";
        }

        echo "\n";
    }

    private function testHelper($user)
    {
        echo "5. Testando PermissionHelper...\n";

        // Testar verificação via helper
        $hasRole = PermissionHelper::userHasRole($user, 'admin');
        echo "   ✓ PermissionHelper::userHasRole('admin'): " . ($hasRole ? 'SIM' : 'NÃO') . "\n";

        $hasPermission = PermissionHelper::userHasPermission($user, 'compras.create');
        echo "   ✓ PermissionHelper::userHasPermission('compras.create'): " . ($hasPermission ? 'SIM' : 'NÃO') . "\n";

        // Testar atribuição via helper
        PermissionHelper::assignPermissionToUser($user, 'compras.delete');
        echo "   ✓ Permissão 'compras.delete' atribuída via helper\n";

        // Verificar se foi atribuída
        $user = $user->fresh(['permissions']);
        $hasDelete = $user->can('compras.delete');
        echo "   ✓ Verificação após atribuição: " . ($hasDelete ? 'SIM' : 'NÃO') . "\n";

        // Obter permissões do módulo
        $modulePermissions = PermissionHelper::getModulePermissions('Compras');
        echo "   ✓ Permissões do módulo Compras: " . count($modulePermissions) . " encontradas\n\n";
    }

    private function testModuleCreation()
    {
        echo "6. Testando criação de módulo...\n";

        // Criar permissões para módulo de teste
        PermissionHelper::createModulePermissions('Teste', ['view', 'create', 'custom']);

        // Verificar se foram criadas
        $testPermissions = Permission::where('module', 'Teste')->get();
        echo "   ✓ Permissões criadas para módulo 'Teste': " . $testPermissions->count() . "\n";

        foreach ($testPermissions as $permission) {
            echo "     - {$permission->name} ({$permission->slug})\n";
        }

        echo "\n";
    }

    /**
     * Método para limpar dados de teste
     */
    public function cleanup()
    {
        echo "Limpando dados de teste...\n";

        // Remover usuário de teste
        User::where('email', 'teste@exemplo.com')->delete();

        // Remover permissões de teste
        Permission::where('module', 'Teste')->delete();

        echo "✓ Limpeza concluída\n";
    }

    /**
     * Método para demonstrar uso em produção
     */
    public function productionExample()
    {
        echo "=== EXEMPLO DE USO EM PRODUÇÃO ===\n\n";

        // Exemplo 1: Verificar permissão em controller
        echo "// Em um controller:\n";
        echo "if (!\$request->user()->can('compras.create')) {\n";
        echo "    abort(403, 'Sem permissão para criar compras');\n";
        echo "}\n\n";

        // Exemplo 2: Middleware em rotas
        echo "// Em routes/web.php:\n";
        echo "Route::middleware(['can:compras.view'])->group(function () {\n";
        echo "    Route::resource('compras', ComprasController::class);\n";
        echo "});\n\n";

        // Exemplo 3: Blade directive
        echo "// Em uma view Blade:\n";
        echo "@can('compras.create')\n";
        echo "    <button>Nova Compra</button>\n";
        echo "@endcan\n\n";

        // Exemplo 4: Atribuir permissões
        echo "// Atribuir permissões a um usuário:\n";
        echo "\$user = User::find(1);\n";
        echo "PermissionHelper::assignRoleToUser(\$user, 'admin');\n";
        echo "PermissionHelper::assignPermissionToUser(\$user, 'compras.create');\n\n";
    }
}
