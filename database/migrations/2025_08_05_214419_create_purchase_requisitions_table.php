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
        Schema::create('purchase_requisitions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->unique();

            //$table->unsignedBigInteger('project_id')->nullable();
            //$table->unsignedBigInteger('cost_center_id')->nullable();
            $table->unsignedBigInteger('responsible_buyer_id')->nullable()->comment('Coluna para atrelar o usuario comprador responsavel'); // Comprador responsável;

            $table->string('order_number');
            $table->bigInteger('order');
            $table->longText('observations')->nullable();
            $table->string('category')->default('Compras de Materiais');

            $table->string('status')->default('draft');

            $table->unsignedBigInteger('user_id');
            $table->timestamp('at')->nullable();
            $table->timestamp('delivery_forecast')->nullable();
            $table->timestamp('order_request')->nullable(); //Data do Pedido de Compra ;
            $table->timestamp('under_negotiation_at')->nullable();

            $table->longText('terms_and_conditions')->nullable();


            $table->softDeletes();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_requisitions');
    }
};
