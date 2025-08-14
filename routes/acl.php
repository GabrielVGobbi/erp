<?php

use App\Http\Controllers\ACL\RolesController;
use App\Http\Controllers\ACL\PermissionsController;
use App\Http\Controllers\ACL\UsersController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:developer'])->prefix('acl')->name('acl.')->group(function () {
    Route::resource('users', UsersController::class);
    Route::get('users/{user}/roles', [UsersController::class, 'manageRoles'])->name('users.roles');
    Route::post('users/{user}/roles', [UsersController::class, 'updateRoles'])->name('users.roles.update');
    Route::get('users/{user}/permissions', [UsersController::class, 'managePermissions'])->name('users.permissions');
    Route::post('users/{user}/permissions', [UsersController::class, 'updatePermissions'])->name('users.permissions.update');

    Route::resource('roles', RolesController::class);
    Route::get('roles/{role}/permissions', [RolesController::class, 'managePermissions'])->name('roles.permissions');
    Route::post('roles/{role}/permissions', [RolesController::class, 'updatePermissions'])->name('roles.permissions.update');

    Route::resource('permissions', PermissionsController::class);
});
