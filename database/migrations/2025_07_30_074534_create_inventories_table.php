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
        Schema::create('inventories', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('name')->nullable();
            $table->string('sku')->nullable();
            $table->string('unit')->nullable();
            $table->string('ean')->nullable();
            $table->string('code_ncm')->nullable();
            $table->string('material_type')->nullable();

            $table->string('length')->nullable();
            $table->string('width')->nullable();
            $table->string('height')->nullable();

            $table->string('cover')->nullable();

            $table->decimal('stock', 10, 2)->default('0');
            $table->decimal('opening_stock', 10, 2)->default('0');
            $table->decimal('refueling_point', 10, 2)->default('0');

            $table->integer('market_price')->default('0');
            $table->integer('last_buy_price')->default('0');
            $table->integer('sale_price')->default('0');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
