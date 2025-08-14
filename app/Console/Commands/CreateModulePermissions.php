<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CreateModulePermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permissions:create-module {module} {--actions=*}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cria permissões para um módulo específico';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $module = $this->argument('module');
        $actions = $this->option('actions');

        // Se não foram especificadas ações, usar as padrão
        if (empty($actions)) {
            $actions = config('permissions.default_actions', ['view', 'create', 'edit', 'delete']);
            $actions = array_keys($actions);
        }

        $this->info("Criando permissões para o módulo: {$module}");

        foreach ($actions as $action) {
            $slug = strtolower($module) . '.' . $action;
            $name = ucfirst($action) . ' ' . ucfirst($module);

            $permission = \App\Modules\ACL\Models\Permission::firstOrCreate([
                'slug' => $slug
            ], [
                'name' => $name,
                'module' => $module,
                'description' => "Permissão para {$action} no módulo {$module}"
            ]);

            if ($permission->wasRecentlyCreated) {
                $this->line("✓ Criada: {$name} ({$slug})");
            } else {
                $this->line("- Já existe: {$name} ({$slug})");
            }
        }

        $this->info("Permissões do módulo {$module} criadas com sucesso!");

        // Perguntar se quer atribuir ao admin
        if ($this->confirm('Deseja atribuir essas permissões à role admin?')) {
            $adminRole = \App\Modules\ACL\Models\Role::where('slug', 'admin')->first();
            if ($adminRole) {
                $permissions = \App\Modules\ACL\Models\Permission::where('module', $module)->get();
                $adminRole->permissions()->syncWithoutDetaching($permissions->pluck('id'));
                $this->info('Permissões atribuídas à role admin!');
            } else {
                $this->error('Role admin não encontrada!');
            }
        }
    }
}
