<?php

namespace Database\Seeders;

use App\Models\CostCenter;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CostCenterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Raiz
        $empresa = CostCenter::create(['name' => 'CenaBr']);

        // Almox
        $almox = CostCenter::create(['name' => 'Almox', 'parent_id' => $empresa->id]);
        $engenharia = CostCenter::create(['name' => 'Engenharia', 'parent_id' => $empresa->id]);
        $rh = CostCenter::create(['name' => 'RH', 'parent_id' => $empresa->id]);
        $comercial = CostCenter::create(['name' => 'Comercial', 'parent_id' => $empresa->id]);
        $presidencia = CostCenter::create(['name' => 'Presidência', 'parent_id' => $empresa->id]);
        $frotas = CostCenter::create(['name' => 'Frotas', 'parent_id' => $empresa->id]);
        $ti = CostCenter::create(['name' => 'TI', 'parent_id' => $empresa->id]);
        $compras = CostCenter::create(['name' => 'Compras', 'parent_id' => $empresa->id]);
        $assessoria = CostCenter::create(['name' => 'Assessoria', 'parent_id' => $empresa->id]);
        $fin = CostCenter::create(['name' => 'Fin & Contr', 'parent_id' => $empresa->id]);
        $operacoes = CostCenter::create(['name' => 'Operações', 'parent_id' => $empresa->id]);

        #CostCenter::create(['name' => 'Almoxarifado Central', 'parent_id' => $almox->id]);
        #CostCenter::create(['name' => 'Almoxarifado Obras', 'parent_id' => $almox->id]);
        #CostCenter::create(['name' => 'Almoxarifado TI', 'parent_id' => $almox->id]);

        // Engenharia
        #CostCenter::create(['name' => 'Projetos Estruturais', 'parent_id' => $engenharia->id]);
        #CostCenter::create(['name' => 'Projetos Elétricos', 'parent_id' => $engenharia->id]);
        #CostCenter::create(['name' => 'Projetos de Execução', 'parent_id' => $engenharia->id]);
        #CostCenter::create(['name' => 'Aprovação Técnica', 'parent_id' => $engenharia->id]);

        // RH
        #CostCenter::create(['name' => 'Recrutamento e Seleção', 'parent_id' => $rh->id]);
        #CostCenter::create(['name' => 'Treinamento e Desenvolvimento', 'parent_id' => $rh->id]);
        #CostCenter::create(['name' => 'Folha de Pagamento', 'parent_id' => $rh->id]);
        #CostCenter::create(['name' => 'Segurança do Trabalho', 'parent_id' => $rh->id]);

        // Comercial
        #CostCenter::create(['name' => 'Pré-vendas', 'parent_id' => $comercial->id]);
        #CostCenter::create(['name' => 'Vendas Diretas', 'parent_id' => $comercial->id]);
        #CostCenter::create(['name' => 'Pós-venda', 'parent_id' => $comercial->id]);
        #CostCenter::create(['name' => 'Atendimento ao Cliente', 'parent_id' => $comercial->id]);

        // Presidência
        #CostCenter::create(['name' => 'Diretoria Executiva', 'parent_id' => $presidencia->id]);
        #CostCenter::create(['name' => 'Planejamento Estratégico', 'parent_id' => $presidencia->id]);
        #CostCenter::create(['name' => 'Comunicação Corporativa', 'parent_id' => $presidencia->id]);

        // Frotas
        #CostCenter::create(['name' => 'Manutenção de Veículos', 'parent_id' => $frotas->id]);
        #CostCenter::create(['name' => 'Combustível', 'parent_id' => $frotas->id]);
        #CostCenter::create(['name' => 'Motoristas', 'parent_id' => $frotas->id]);
        #CostCenter::create(['name' => 'Logística e Roteirização', 'parent_id' => $frotas->id]);

        // TI
        #CostCenter::create(['name' => 'Infraestrutura', 'parent_id' => $ti->id]);
        #CostCenter::create(['name' => 'Suporte Técnico', 'parent_id' => $ti->id]);
        #CostCenter::create(['name' => 'Sistemas Corporativos', 'parent_id' => $ti->id]);
        #CostCenter::create(['name' => 'Desenvolvimento de Software', 'parent_id' => $ti->id]);

        // Compras
        #CostCenter::create(['name' => 'Compras Diretas', 'parent_id' => $compras->id]);
        #CostCenter::create(['name' => 'Compras Indiretas', 'parent_id' => $compras->id]);
        #CostCenter::create(['name' => 'Suprimentos', 'parent_id' => $compras->id]);
        #CostCenter::create(['name' => 'Controle de Fornecedores', 'parent_id' => $compras->id]);

        // Operações
        #CostCenter::create(['name' => 'Produção', 'parent_id' => $operacoes->id]);
        #CostCenter::create(['name' => 'Supervisão', 'parent_id' => $operacoes->id]);
        #CostCenter::create(['name' => 'Logística Interna', 'parent_id' => $operacoes->id]);
        #CostCenter::create(['name' => 'Controle de Qualidade', 'parent_id' => $operacoes->id]);

        // Fin & Contr
        #CostCenter::create(['name' => 'Contas a Pagar', 'parent_id' => $fin->id]);
        #CostCenter::create(['name' => 'Contas a Receber', 'parent_id' => $fin->id]);
        #CostCenter::create(['name' => 'Tesouraria', 'parent_id' => $fin->id]);
        #CostCenter::create(['name' => 'Contabilidade', 'parent_id' => $fin->id]);
        #CostCenter::create(['name' => 'Controladoria', 'parent_id' => $fin->id]);

        // Assessoria
        #CostCenter::create(['name' => 'Jurídico', 'parent_id' => $assessoria->id]);
        #CostCenter::create(['name' => 'Compliance', 'parent_id' => $assessoria->id]);
        #CostCenter::create(['name' => 'Auditoria Interna', 'parent_id' => $assessoria->id]);
    }
}
