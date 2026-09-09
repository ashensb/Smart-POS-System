<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    /**
     * Get list of all sales history for Admin Panel.
     */
    public function index(Request $request)
    {
        $query = Sale::with(['items.product', 'user']);

        // Optional date filter
        if ($request->has('date') && !empty($request->date)) {
            $query->whereDate('created_at', $request->date);
        }

        $sales = $query->latest()->get();

        return response()->json($sales);
    }

    /**
     * Get specific sale invoice details.
     */
    public function show($id)
    {
        $sale = Sale::with(['items.product', 'user'])->findOrFail($id);
        
        return response()->json($sale);
    }
}