<?php

use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\CommentController;
use App\Http\Controllers\Admin\LikeController;
use App\Http\Controllers\Admin\CampaignController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here is where you can register admin routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {

    // User management
    Route::resource('users', UserController::class);
    Route::post('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');

    // Company management
    Route::resource('companies', CompanyController::class);
    Route::post('companies/{company}/toggle-status', [CompanyController::class, 'toggleStatus'])->name('companies.toggle-status');

    // Role management
    Route::resource('roles', RoleController::class);
    Route::get('roles-stats', [RoleController::class, 'stats'])->name('roles.stats');

    // Plan management
    Route::resource('plans', PlanController::class);
    Route::post('plans/{plan}/toggle-status', [PlanController::class, 'toggleStatus'])->name('plans.toggle-status');
    Route::get('plans-stats', [PlanController::class, 'stats'])->name('plans.stats');

    // Blog Posts management
    Route::resource('posts', PostController::class);
    Route::get('posts-stats', [PostController::class, 'stats'])->name('posts.stats');

    // Comments management
    Route::resource('comments', CommentController::class);
    Route::post('comments/{comment}/approve', [CommentController::class, 'approve'])->name('comments.approve');
    Route::post('comments/{comment}/reject', [CommentController::class, 'reject'])->name('comments.reject');
    Route::post('comments/bulk-approve', [CommentController::class, 'bulkApprove'])->name('comments.bulk-approve');
    Route::post('comments/bulk-reject', [CommentController::class, 'bulkReject'])->name('comments.bulk-reject');
    Route::post('comments/bulk-delete', [CommentController::class, 'bulkDelete'])->name('comments.bulk-delete');
    Route::get('comments-stats', [CommentController::class, 'stats'])->name('comments.stats');

    // Likes management
    Route::resource('likes', LikeController::class)->only(['index', 'show', 'destroy']);
    Route::post('likes/bulk-delete', [LikeController::class, 'bulkDelete'])->name('likes.bulk-delete');
    Route::get('likes-stats', [LikeController::class, 'stats'])->name('likes.stats');

    // Campaign management
    Route::resource('campaigns', CampaignController::class);
    Route::get('campaigns-stats', [CampaignController::class, 'stats'])->name('campaigns.stats');

    // API routes
    Route::get('api/users', [UserController::class, 'api'])->name('api.users');
    Route::get('api/companies', [CompanyController::class, 'api'])->name('api.companies');

});
