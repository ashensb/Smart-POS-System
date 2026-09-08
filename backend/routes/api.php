<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\SaleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\User\POSController;
use App\Http\Controllers\User\PaymentController;

// Public Auth Route
Route::post('/login', [AuthController::class, 'login']);

// Protected APIs (Sanctum Token required)
Route::middleware('auth:sanctum')->group(function () {

    // Auth & User Profile Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Admin Routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::apiResource('/products', ProductController::class);

        // Category Routes
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // Sales Routes
        Route::get('/sales', [SaleController::class, 'index']);
        Route::post('/sales', [SaleController::class, 'store']);
        Route::get('/sales/{id}', [SaleController::class, 'show']);

        // Reports Routes (Reports Component එක සඳහා)
        Route::get('/reports', [ReportController::class, 'index']);

        // User Management Routes
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });

    // Cashier / User Routes
    Route::middleware('role:cashier,admin')->prefix('user')->group(function () {
        Route::get('/pos/products', [POSController::class, 'getProducts']);
        Route::post('/payment', [PaymentController::class, 'processPayment']);
    });

});