<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PlanController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::get('/como-funciona', function () {
    return Inertia::render('how-it-works');
})->name('how-it-works');

Route::get('/agencias', function () {
    return Inertia::render('agencies');
})->name('agencies');

Route::get('/quieres-ser-woblis', function () {
    return Inertia::render('drivers');
})->name('drivers');

// Blog routes
Route::prefix('woblog')->name('blog.')->group(function () {
    Route::get('/', [PostController::class, 'index'])->name('index');
    Route::get('/buscar', [PostController::class, 'search'])->name('search');
    Route::get('/{post:slug}', [PostController::class, 'show'])->name('show');
    Route::post('/{post}/like', [PostController::class, 'toggleLike'])->name('like');

    // Admin routes (for future dashboard)
    Route::middleware(['auth', 'role:admin,company_active'])->group(function () {
        Route::get('/admin/crear', [PostController::class, 'create'])->name('create');
        Route::post('/admin', [PostController::class, 'store'])->name('store');
        Route::get('/admin/{post:slug}/editar', [PostController::class, 'edit'])->name('edit');
        Route::put('/admin/{post}', [PostController::class, 'update'])->name('update');
        Route::delete('/admin/{post}', [PostController::class, 'destroy'])->name('destroy');
    });
});

// Comments API routes
Route::prefix('api/comments')->name('comments.')->group(function () {
    Route::get('/post/{post}', [CommentController::class, 'getByPost'])->name('by-post');
    Route::post('/', [CommentController::class, 'store'])->name('store');
    Route::post('/{comment}/like', [CommentController::class, 'toggleLike'])->name('like');

    // Admin routes
    Route::middleware(['auth', 'role:admin,company_active'])->group(function () {
        Route::get('/', [CommentController::class, 'index'])->name('index');
        Route::get('/{comment}', [CommentController::class, 'show'])->name('show');
        Route::put('/{comment}', [CommentController::class, 'update'])->name('update');
        Route::delete('/{comment}', [CommentController::class, 'destroy'])->name('destroy');
    });
});

// Likes API routes
Route::prefix('api/likes')->name('likes.')->group(function () {
    Route::post('/', [LikeController::class, 'store'])->name('store');
    Route::get('/stats', [LikeController::class, 'stats'])->name('stats');

    // Admin routes
    Route::middleware(['auth', 'role:admin,company_active'])->group(function () {
        Route::get('/', [LikeController::class, 'index'])->name('index');
        Route::delete('/{like}', [LikeController::class, 'destroy'])->name('destroy');
    });
});

// Plans API routes (public)
Route::prefix('api/plans')->name('api.plans.')->group(function () {
    Route::get('/', [PlanController::class, 'index'])->name('index');
    Route::get('/{plan:slug}', [PlanController::class, 'show'])->name('show');
});

// Survey routes (public)
Route::prefix('encuesta')->name('survey.')->group(function () {
    Route::get('/{campaign:slug}', [SurveyController::class, 'show'])->name('show');
    Route::post('/{campaign:slug}/iniciar', [SurveyController::class, 'start'])->name('start');
    Route::post('/{campaign:slug}/enviar', [SurveyController::class, 'submit'])->name('submit');
    Route::get('/qr/{campaign:slug}', [SurveyController::class, 'qr'])->name('qr');
});

// Dashboard route with metrics
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth'])
    ->name('dashboard');

// Dashboard export route
Route::get('/dashboard/export', [DashboardController::class, 'export'])
    ->middleware(['auth'])
    ->name('dashboard.export');

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
