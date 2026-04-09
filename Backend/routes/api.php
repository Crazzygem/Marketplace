<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\LoggerController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewsController;
use App\Http\Controllers\SavedItemController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ShopMemberController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Public endpoint for client-side error logging (no auth required)
Route::post('/logs/client-errors', [LoggerController::class, 'clientErrors']);

/*
|--------------------------------------------------------------------------
| Public Routes (No Token Required for Read Operations)
|--------------------------------------------------------------------------
*/
// Public access to view categories
Route::get('/categories', [CategoriesController::class, 'index']);
Route::get('/categories/{id}', [CategoriesController::class, 'show']);

// Public access to view listings
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{id}', [ListingController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Must have Token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // User / Auth
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('throttle:10,1');
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // --- CATEGORIES MANAGEMENT ---
    // Protected access for managing categories
    Route::post('/categories', [CategoriesController::class, 'store']);
    Route::put('/categories/{id}', [CategoriesController::class, 'update']);
    Route::patch('/categories/{id}/popular', [CategoriesController::class, 'togglePopular']);
    Route::delete('/categories/{id}', [CategoriesController::class, 'destroy']);

    // --- LISTING MANAGEMENT ---
    // Define individual routes to have more control over authentication
    Route::post('/listings', [ListingController::class, 'store']);
    Route::put('/listings/{id}', [ListingController::class, 'update']);
    Route::delete('/listings/{id}', [ListingController::class, 'destroy']);
    Route::post('/listings/{id}/mark-as-sold', [ListingController::class, 'markAsSold']);
    Route::post('/listings/{id}/restock', [ListingController::class, 'restock']);

    // --- ORDER MANAGEMENT ---
    Route::apiResource('orders', OrderController::class);

    // --- SHOP MEMBER MANAGEMENT ---
    Route::apiResource('shop-members', ShopMemberController::class);

    // --- REVIEWS MANAGEMENT ---
    Route::apiResource('reviews', ReviewsController::class);

    // --- CHAT MANAGEMENT ---
    Route::get('/chats', [ChatController::class, 'index']);
    Route::post('/chats', [ChatController::class, 'store']);
    Route::get('/chats/{id}', [ChatController::class, 'show']);
    Route::post('/chats/{id}/messages', [ChatController::class, 'sendMessage']);

    // --- SAVED ITEMS MANAGEMENT ---
    Route::get('/saved-items', [SavedItemController::class, 'index']);
    Route::post('/saved-items', [SavedItemController::class, 'store']);
    Route::post('/saved-items/toggle', [SavedItemController::class, 'toggle']);
    Route::get('/saved-items/{listingId}/is-saved', [SavedItemController::class, 'isSaved']);
    Route::delete('/saved-items/{id}', [SavedItemController::class, 'destroy']);

    // --- SHOP MANAGEMENT (Business Logic) ---
    Route::post('/shops', [ShopController::class, 'store']); // Create Shop
    Route::get('/my-shop/stats', [ShopController::class, 'stats']); // Shop Dashboard Charts

     // --- ADMIN DASHBOARD (Governance) ---
    // In a real app, you would add middleware here like 'can:admin'
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboardStats'])->middleware('admin'); // The BIG Charts
        Route::get('/users', [AdminController::class, 'getUsers'])->middleware('admin'); // Get all users
        Route::post('/users', [AdminController::class, 'createUser'])->middleware('admin'); // Create new user
        Route::put('/users/{id}/role', [AdminController::class, 'updateUserRole'])->middleware('admin'); // Update user role
        Route::post('/users/{id}/ban', [AdminController::class, 'banUser'])->middleware('admin'); // Control
        Route::post('/users/{id}/unban', [AdminController::class, 'unbanUser'])->middleware('admin'); // Control
        Route::post('/shops/{id}/verify', [AdminController::class, 'verifyShop'])->middleware('admin'); // Control

        // ADMIN MODERATION
        Route::get('/reports', [AdminController::class, 'getReports'])->middleware('admin');
        Route::post('/reports/{id}/resolve', [AdminController::class, 'resolveReport'])->middleware('admin');
    });


});
