<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\TopicController;
use App\Http\Controllers\Api\QuestionController;


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

// Admin API маршруты (с защитой)
// Admin API маршруты (с защитой)
Route::prefix('api/admin')->middleware('admin')->group(function () {
    // Предметы
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::post('/subjects', [SubjectController::class, 'store']);
    Route::put('/subjects/{id}', [SubjectController::class, 'update']);
    Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);
    
    // Темы
    Route::get('/topics', [TopicController::class, 'index']);
    Route::post('/topics', [TopicController::class, 'store']);
    Route::put('/topics/{id}', [TopicController::class, 'update']);
    Route::delete('/topics/{id}', [TopicController::class, 'destroy']);
    
    // Вопросы
    Route::get('/questions', [QuestionController::class, 'index']);
    Route::post('/questions', [QuestionController::class, 'store']);
    Route::put('/questions/{id}', [QuestionController::class, 'update']);
    Route::delete('/questions/{id}', [QuestionController::class, 'destroy']);
});

// CORS для всех OPTIONS запросов (должен быть последним)
Route::options('/{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Token-Auth, Authorization');
})->where('any', '.*');