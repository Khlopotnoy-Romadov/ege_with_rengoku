<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SubjectController;

// Корневой маршрут
Route::get('/', function () {
    return response()->json([
        'message' => '🔥 EGE with Rengoku API',
        'version' => '1.0',
        'endpoints' => [
            'subjects' => '/api/v1/subjects',
            'subject_full' => '/api/v1/subjects/{slug}/full',
        ]
    ]);
});

// API маршруты
Route::prefix('api/v1')->group(function () {
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::get('/subjects/{slug}/full', [SubjectController::class, 'showFull']);
});

// CORS для всех OPTIONS запросов (должен быть последним)
Route::options('/{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Token-Auth, Authorization');
})->where('any', '.*');