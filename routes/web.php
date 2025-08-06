<?php

use App\Http\Controllers\AccountingEntryController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ChartAccountController;
use App\Http\Controllers\CostCenterController;
use App\Http\Controllers\App\InventoryController;
use App\Http\Controllers\PurchaseRequisitionController;
use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("ping", function () {
    return response()->json(['message' => 'pong'], 200);
})->name('ping');

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('organizations', OrganizationController::class);
    Route::resource('branches', BranchController::class);
    Route::resource('suppliers', SupplierController::class);
    Route::resource('chart-accounts', ChartAccountController::class);
    Route::resource('accounting-entries', AccountingEntryController::class);
    Route::resource('cost-centers', CostCenterController::class);
    Route::resource('inventories', InventoryController::class);
    Route::resource('purchaseRequisitions', PurchaseRequisitionController::class);

    Route::name('table.')->prefix('tables/')->group(
        function () {
            Route::get('organizations', [App\Http\Controllers\Api\TablesApiController::class, 'organizations'])->name('organizations');
            Route::get('branches', [App\Http\Controllers\Api\TablesApiController::class, 'branches'])->name('branches');
            Route::get('suppliers', [App\Http\Controllers\Api\TablesApiController::class, 'suppliers'])->name('suppliers');
            Route::get('accounting-entries', [App\Http\Controllers\Api\TablesApiController::class, 'accountingEntries'])->name('accountingEntries');
            Route::get('costCenters', [App\Http\Controllers\Api\TablesApiController::class, 'costCenters'])->name('costCenters');
            Route::get('inventories', [App\Http\Controllers\Api\TablesApiController::class, 'inventories'])->name('inventories');
        }
    );
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
