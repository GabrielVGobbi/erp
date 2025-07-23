<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Rotas de Overview
    Route::get('organizations', function () {
        return Inertia::render('organizations/index');
    })->name('organizations.index');

    //Route::get('branches', function () {
    //    return Inertia::render('branches/index');
    //})->name('branches.index');
    //
    //// Rotas de Contabilidade
    //Route::get('chart-of-accounts', function () {
    //    return Inertia::render('accounting/chart-of-accounts');
    //})->name('accounting.chart-of-accounts');
    //
    //Route::get('cost-centers', function () {
    //    return Inertia::render('accounting/cost-centers');
    //})->name('accounting.cost-centers');
    //
    //Route::get('business-units', function () {
    //    return Inertia::render('accounting/business-units');
    //})->name('accounting.business-units');
    //
    //Route::get('accounting-entries', function () {
    //    return Inertia::render('accounting/entries');
    //})->name('accounting.entries');
    //
    //// Rotas de Organização
    //Route::get('projects', function () {
    //    return Inertia::render('projects/index');
    //})->name('projects.index');
    //
    //// Rotas de Configurações
    //Route::get('settings', function () {
    //    return Inertia::render('settings/index');
    //})->name('settings.index');
    //
    //Route::get('help', function () {
    //    return Inertia::render('help/index');
    //})->name('help.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

