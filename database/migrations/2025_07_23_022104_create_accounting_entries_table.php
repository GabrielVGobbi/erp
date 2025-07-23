<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('accounting_entries', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->unique();

            // Relacionamentos
            $table->foreignId('chart_account_id')->constrained('chart_accounts')->onDelete('cascade');
            $table->foreignId('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->onDelete('cascade');

            // Informações do lançamento
            $table->date('posting_date'); // Data da postagem
            $table->string('voucher_type'); // Tipo de comprovante (Purchase Receipt, etc.)
            $table->string('voucher_subtype')->nullable(); // Subtipo do comprovante
            $table->string('voucher_number'); // Número do comprovante
            $table->string('against_voucher_number')->nullable(); // Número do comprovante contra
            $table->string('partner_type')->nullable(); // Tipo de parceiro
            $table->string('partner')->nullable(); // Parceiro
            $table->string('project')->nullable(); // Projeto
            $table->string('cost_center')->nullable(); // Centro de custos
            $table->string('currency', 3)->default('BRL'); // Moeda
            $table->text('description')->nullable(); // Descrição do lançamento
            $table->text('remarks')->nullable(); // Observações

            // Valores monetários
            $table->decimal('debit', 18, 2)->default(0); // Débito
            $table->decimal('credit', 18, 2)->default(0); // Crédito
            $table->decimal('balance', 18, 2)->default(0); // Saldo

            // Status e controle
            $table->enum('status', ['active', 'cancelled', 'draft'])->default('active');
            $table->boolean('is_opening_entry')->default(false); // É lançamento de abertura
            $table->boolean('is_closing_entry')->default(false); // É lançamento de fechamento
            $table->boolean('is_system_generated')->default(false); // É gerado pelo sistema
            $table->timestamp('posted_at')->nullable(); // Data/hora da postagem

            $table->softDeletes();
            $table->timestamps();

            // Índices para performance
            $table->index(['organization_id', 'chart_account_id', 'posting_date'], 'idx_org_chart_date');
            $table->index(['voucher_type', 'voucher_number'], 'idx_voucher_type_number');
            $table->index(['posting_date', 'status'], 'idx_date_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounting_entries');
    }
};
