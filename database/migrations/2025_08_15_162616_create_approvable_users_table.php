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
        Schema::create('approval_assignments', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('role_id')->constrained('roles');

            $table->morphs('context');

            $table->unique(['user_id', 'role_id', 'context_id', 'context_type'], 'context_user_role_unique');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approvable_users');
    }
};
