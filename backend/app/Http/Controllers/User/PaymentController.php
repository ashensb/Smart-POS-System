<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'payment_method' => 'required|in:cash,card,qr',
        ]);

        return DB::transaction(function () use ($request) {
            $totalAmount = 0;

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                if ($product->stock_quantity < $item['quantity']) {
                    throw new \Exception("Insufficient stock for {$product->name}");
                }
                $totalAmount += $product->price * $item['quantity'];
            }

            $discount = $request->discount ?? 0;
            $netTotal = $totalAmount - $discount;

            $sale = Sale::create([
                'invoice_no' => 'INV-' . strtoupper(Str::random(8)),
                'user_id' => auth()->id(),
                'customer_id' => $request->customer_id,
                'total_amount' => $totalAmount,
                'discount' => $discount,
                'net_total' => $netTotal,
                'payment_method' => $request->payment_method,
            ]);

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);

                // Stock Auto Reduction
                $product->decrement('stock_quantity', $item['quantity']);

                StockMovement::create([
                    'product_id' => $product->id,
                    'quantity_change' => -$item['quantity'],
                    'type' => 'sale',
                    'note' => "Invoice #{$sale->invoice_no}",
                ]);
            }

            return response()->json(['message' => 'Payment Successful', 'sale' => $sale->load('saleItems')], 201);
        });
    }
}