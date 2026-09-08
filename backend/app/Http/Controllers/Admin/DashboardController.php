<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalSales = Sale::sum('net_total');
        $totalOrders = Sale::count();
        $totalProducts = Product::count();
        $lowStockCount = Product::where('stock_quantity', '<=', 5)->count();

        // Admin Dashboard එකේ Recent Sales Activity පෙන්වීමට items load කර ඇත
        $recentSales = Sale::with('items.product')->latest()->take(5)->get();

        return response()->json([
            'total_sales' => $totalSales ?? 0,
            'total_orders' => $totalOrders,
            'total_products' => $totalProducts,
            'low_stock_count' => $lowStockCount,
            'recent_sales' => $recentSales,
        ]);
    }
}