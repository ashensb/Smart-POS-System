<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sku',
        'category_id',
        'price',
        'cost_price',
        'stock_quantity',
        'reorder_level',
        'image',
    ];

    // Category එක සමඟ තිබෙන Relationship එක
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}