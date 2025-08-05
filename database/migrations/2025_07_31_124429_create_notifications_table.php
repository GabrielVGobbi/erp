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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type'); // info, success, warning, error
            $table->string('title');
            $table->text('message');
            $table->string('icon')->nullable(); // Ícone da notificação
            $table->json('data')->nullable(); // Dados adicionais
            $table->string('action_url')->nullable(); // URL para ação
            $table->string('action_text')->nullable(); // Texto do botão de ação
            $table->timestamp('read_at')->nullable();
            $table->timestamp('expires_at')->nullable(); // Data de expiração
            $table->boolean('is_important')->default(false); // Notificação importante
            $table->timestamps();
            
            $table->index(['user_id', 'read_at']);
            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'is_important']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
