<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class POSController extends Controller
{
    /**
     * Get Categories & Products for POS Terminal
     */
    public function getPOSData()
    {
        $categories = Category::all();
        
        // Database Column Name: stock_quantity
        $products = Product::with('category')
            ->where('stock_quantity', '>', 0)
            ->latest()
            ->get();

        return response()->json([
            'categories' => $categories,
            'products'   => $products
        ]);
    }

    /**
     * Checkout Process
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'items'          => 'required|array|min:1',
            'items.*.id'     => 'required|exists:products,id',
            'items.*.qty'    => 'required|integer|min:1',
            'items.*.price'  => 'required|numeric',
            'payment_method' => 'required|string|in:CASH,CARD,QR',
            'discount'       => 'nullable|numeric|min:0',
            'subtotal'       => 'required|numeric',
            'net_total'      => 'required|numeric',
        ]);

        DB::beginTransaction();

        try {
            $invoiceNo = 'INV-' . date('Ymd') . '-' . rand(1000, 9999);

            $sale = Sale::create([
                'invoice_no'     => $invoiceNo,
                'user_id'        => auth()->id() ?? 1,
                'subtotal'       => $request->subtotal,
                'discount'       => $request->discount ?? 0,
                'net_total'      => $request->net_total,
                'payment_method' => $request->payment_method,
            ]);

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['id']);

                if ($product->stock_quantity < $item['qty']) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Insufficient stock for: {$product->name}"
                    ], 400);
                }

                SaleItem::create([
                    'sale_id'    => $sale->id,
                    'product_id' => $product->id,
                    'quantity'   => $item['qty'],
                    'price'      => $item['price'],
                    'total'      => $item['qty'] * $item['price'],
                ]);

                // Deduct Stock Quantity
                $product->decrement('stock_quantity', $item['qty']);
            }

            DB::commit();

            $sale->load(['items.product', 'user']);

            return response()->json([
                'success' => true,
                'message' => 'Order completed successfully!',
                'sale'    => $sale
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Order checkout failed: ' . $e->getMessage()
            ], 500);
        }
    }
}