<?php

namespace Database\Seeders;

use App\Models\ApprovalAssignment;
use App\Models\CostCenter;
use App\Models\Project;
use App\Models\User;
use App\Modules\ACL\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ApprovalAssignmentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereIn('email', [
            'marcos_varella@teste.com',
            'nelly@teste.com',
            'requisitante@teste.com',
            'carol_frotas@teste.com',
            'walter_gerente_geral@teste.com',
        ])->get()->keyBy('email');

        $ceo = $users['marcos_varella@teste.com'];
        $cfo = $users['nelly@teste.com'];
        $requisitante = $users['requisitante@teste.com'];

        $roleManager = Role::where('slug', 'manager')->first();
        $roleGenManager = Role::where('slug', 'general-manager')->first();
        $roleFinance = Role::where('slug', 'finance')->first();
        $roleSupervisor = Role::where('slug', 'supervisor')->first();
        $roleCEO = Role::where('slug', 'ceo')->first();

        $ccAlmox = CostCenter::where('name', 'Almox')->first();
        $ccEngenharia = CostCenter::where('name', 'Engenharia')->first();
        $ccFinContr = CostCenter::where('name', 'Fin & Contr')->first();
        $ccPresidencia = CostCenter::where('name', 'Presidência')->first();
        $ccFrotas = CostCenter::where('name', 'Frotas')->first();
        $projX = Project::where('name', 'Projeto 1')->first();

        // Atribuições para o Centro de Custo Engenharia
        //ApprovalAssignment::create([
        //    'user_id' => $gerente->id,
        //    'role_id' => $roleManager->id,
        //    'context_id' => $ccEngenharia->id,
        //    'context_type' => CostCenter::class,
        //]);

        //ApprovalAssignment::create([
        //    'user_id' => $gerenteGeral->id,
        //    'role_id' => $roleGenManager->id,
        //    'context_id' => $ccEngenharia->id,
        //    'context_type' => CostCenter::class,
        //]);

        //// Atribuições para o Centro de Custo Almoxarifado
        //ApprovalAssignment::create([
        //    'user_id' => $supervisor->id,
        //    'role_id' => $roleSupervisor->id,
        //    'context_id' => $ccAlmox->id,
        //    'context_type' => CostCenter::class,
        //]);

        //ApprovalAssignment::create([
        //    'user_id' => $gerente->id,
        //    'role_id' => $roleManager->id,
        //    'context_id' => $ccAlmox->id,
        //    'context_type' => CostCenter::class,
        //]);

        //ApprovalAssignment::create([
        //    'user_id' => $gerenteGeral->id,
        //    'role_id' => $roleGenManager->id,
        //    'context_id' => $ccAlmox->id,
        //    'context_type' => CostCenter::class,
        //]);

        // Atribuições Globais por departamento
        ApprovalAssignment::create([
            'user_id' => $cfo->id,
            'role_id' => $roleFinance->id,
            'context_id' => $ccFinContr->id,
            'context_type' => CostCenter::class,
        ]);

        // Atribuições para um Projeto
        //ApprovalAssignment::create([
        //    'user_id' => $gerenteGeral->id,
        //    'role_id' => $roleManager->id,
        //    'context_id' => $projX->id,
        //    'context_type' => Project::class,
        //]);

        $walter = User::where('email', 'walter_gerente_geral@teste.com')->first();
        $carol = User::where('email', 'carol_frotas@teste.com')->first();
        ApprovalAssignment::create([
            'user_id' => $carol->id,
            'role_id' => $roleManager->id,
            'context_id' => $ccFrotas->id,
            'context_type' => CostCenter::class,
        ]);

        ApprovalAssignment::create([
            'user_id' => $walter->id,
            'role_id' => $roleGenManager->id,
            'context_id' => $ccFrotas->id,
            'context_type' => CostCenter::class,
        ]);
    }
}
