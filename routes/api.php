<?php

use App\Http\Controllers\Api\AuthenticateApiController;
use App\Http\Controllers\Api\PurchaseRequisitionApiController;
use Illuminate\Support\Facades\Route;

const API_VERSION = 'v1';

Route::post('auth', [AuthenticateApiController::class, 'login'])->name('api.login');

Route::name('api.')->prefix(API_VERSION . '/')->middleware(['auth:sanctum'])->group(function () {

    Route::get("ping", function () {
        return response()->json(['message' => 'pong'], 200);
    })->name('ping');

    Route::apiResource('purchase-requisitions', PurchaseRequisitionApiController::class);
});
