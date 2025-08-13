<?php

use App\Http\Controllers\Api\AuthenticateApiController;
use App\Http\Controllers\Api\ProjectApiController;
use App\Http\Controllers\Api\TablesApiController;
use App\Http\Middleware\MultiAuthMiddleware;
use App\Models\CostCenter;
use App\Modules\Compras\Http\Api\InventoryApiController;
use App\Modules\Compras\Http\Api\PurchaseRequisitionApiController as PRApi;
use Illuminate\Support\Facades\Route;

const API_VERSION = 'v1';

Route::post('auth', [AuthenticateApiController::class, 'login'])->name('api.login');

Route::name('api.')->prefix(API_VERSION . '/')->group(function () {

    Route::get("ping", function () {
        return response()->json(['message' => 'pong'], 200);
    })->name('ping');


    /*
    |--------------------------------------------------------------------------
    | Projects
    |--------------------------------------------------------------------------
    */
    Route::apiResource('projects', ProjectApiController::class);

    /*
    |--------------------------------------------------------------------------
    | Requisições de Compra
    |--------------------------------------------------------------------------
    */
    Route::apiResource('purchase-requisitions', PRApi::class);
    Route::patch('purchase-requisitions/{id}/status', [PRApi::class, 'updateStatus'])->name('purchase-requisitions.update-status');
    Route::get('purchase-requisitions/{id}/available-transitions', [PRApi::class, 'getAvailableTransitions'])->name('purchase-requisitions.available-transitions');

    /*
    |--------------------------------------------------------------------------
    | Inventario
    |--------------------------------------------------------------------------
    */
    Route::get('inventories', [InventoryApiController::class, 'index'])->name('inventories');


    /*
    |--------------------------------------------------------------------------
    | Listagem
    |--------------------------------------------------------------------------
    */
    Route::get('{tableName}', [TablesApiController::class, 'index'])->name('index');
});
