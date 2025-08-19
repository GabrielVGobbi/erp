<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\ACL\Models\Role;
use App\Modules\ACL\Models\Permission;

class ApprovalRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Roles de aprovação hierárquica
        $approvalRoles = [
            [
                'name' => 'Gerente Geral',
                'slug' => 'general-manager',
                'description' => 'Gerente Geral com autoridade máxima de aprovação'
            ],
            [
                'name' => 'Gerente',
                'slug' => 'manager',
                'description' => 'Gerente com autoridade de aprovação intermediária'
            ],
            [
                'name' => 'Supervisor',
                'slug' => 'supervisor',
                'description' => 'Supervisor com autoridade de aprovação básica'
            ],
            [
                'name' => 'Coordenador',
                'slug' => 'coordinator',
                'description' => 'Coordenador com autoridade de aprovação limitada'
            ],
            [
                'name' => 'CEO',
                'slug' => 'ceo',
                'description' => 'Chief Executive Officer'
            ],
            [
                'name' => 'CFO',
                'slug' => 'cfo',
                'description' => 'Chief Financial Officer'
            ]
        ];

        foreach ($approvalRoles as $roleData) {
            Role::firstOrCreate(
                ['slug' => $roleData['slug']],
                $roleData
            );
        }

        // Permissões relacionadas ao gerenciamento de aprovadores
        $approvalPermissions = [
            [
                'name' => 'Gerenciar Aprovadores',
                'slug' => 'manage-approvers',
                'group' => 'Aprovação',
                'description' => 'Permissão para gerenciar aprovadores em contextos específicos'
            ],
            [
                'name' => 'Visualizar Estrutura de Aprovação',
                'slug' => 'view-approval-structure',
                'group' => 'Aprovação',
                'description' => 'Permissão para visualizar a estrutura de aprovação'
            ],
            [
                'name' => 'Aprovar Solicitações',
                'slug' => 'approve-requests',
                'group' => 'Aprovação',
                'description' => 'Permissão para aprovar solicitações'
            ],
            [
                'name' => 'Aprovar Requisições de Compra',
                'slug' => 'approve-purchases-requests',
                'group' => 'Aprovação',
                'description' => 'Permissão para aprovar requisições de compra'
            ]
        ];

        foreach ($approvalPermissions as $permissionData) {
            Permission::firstOrCreate(
                ['slug' => $permissionData['slug']],
                $permissionData
            );
        }

        // Atribuir permissões às roles
        $adminRole = Role::where('slug', 'admin')->first();
        $devRole = Role::where('slug', 'dev')->first();
        $generalManagerRole = Role::where('slug', 'general-manager')->first();
        $financeRole = Role::where('slug', 'finance')->first();

        // Buscar as permissões criadas
        $manageApproversPermission = Permission::where('slug', 'manage-approvers')->first();
        $viewApprovalStructurePermission = Permission::where('slug', 'view-approval-structure')->first();
        $approveRequestsPermission = Permission::where('slug', 'approve-requests')->first();

        // Permissões para admin e dev
        if ($adminRole && $manageApproversPermission && $viewApprovalStructurePermission && $approveRequestsPermission) {
            $adminRole->permissions()->syncWithoutDetaching([
                $manageApproversPermission->id,
                $viewApprovalStructurePermission->id,
                $approveRequestsPermission->id,
            ]);
        }

        if ($devRole && $manageApproversPermission && $viewApprovalStructurePermission && $approveRequestsPermission) {
            $devRole->permissions()->syncWithoutDetaching([
                $manageApproversPermission->id,
                $viewApprovalStructurePermission->id,
                $approveRequestsPermission->id,
            ]);
        }

        // Permissões específicas para roles de aprovação
        if ($generalManagerRole && $approveRequestsPermission && $viewApprovalStructurePermission) {
            $generalManagerRole->permissions()->syncWithoutDetaching([
                $approveRequestsPermission->id,
                $viewApprovalStructurePermission->id,
            ]);
        }

        if ($financeRole && $approveRequestsPermission && $viewApprovalStructurePermission) {
            $financeRole->permissions()->syncWithoutDetaching([
                $approveRequestsPermission->id,
                $viewApprovalStructurePermission->id,
            ]);
        }

        $this->command->info('Approval roles and permissions seeded successfully!');
    }
}
