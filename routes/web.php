<?php

use App\Http\Controllers\AccountingEntryController;
use App\Http\Controllers\Api\TablesApiController;
use App\Http\Controllers\App\HomeController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ChartAccountController;
use App\Http\Controllers\CostCenterController;
use App\Http\Controllers\App\InventoryController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SupplierController;
use App\Http\Middleware\MultiAuthMiddleware;
use App\Modules\Compras\Http\PurchaseRequisitionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("ping", function () {
    return response()->json(['message' => 'pong'], 200);
})->name('ping');

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware([MultiAuthMiddleware::class])->group(function () {

    Route::get('dashboard', [HomeController::class, 'index'])->name('dashboard');

    Route::resource('organizations', OrganizationController::class);
    Route::resource('branches', BranchController::class);
    Route::resource('suppliers', SupplierController::class);
    Route::resource('chart-accounts', ChartAccountController::class);
    Route::resource('accounting-entries', AccountingEntryController::class);
    Route::resource('cost-centers', CostCenterController::class);
    Route::resource('inventories', InventoryController::class);
    Route::resource('purchase-requisitions', PurchaseRequisitionController::class);
    Route::resource('projects', ProjectController::class);

    Route::name('table.')->prefix('tables/')->group(
        function () {
            Route::get('users', [App\Http\Controllers\Api\ACLTablesApiController::class, 'users'])->name('users');
            Route::get('roles', [App\Http\Controllers\Api\ACLTablesApiController::class, 'roles'])->name('roles');
            Route::get('permissions', [App\Http\Controllers\Api\ACLTablesApiController::class, 'permissions'])->name('permissions');
            Route::get('{tableName}', [TablesApiController::class, 'index'])->name('index');
        }
    );
});

require __DIR__ . '/settings.php';
require __DIR__ . '/acl.php';
require __DIR__ . '/auth.php';
