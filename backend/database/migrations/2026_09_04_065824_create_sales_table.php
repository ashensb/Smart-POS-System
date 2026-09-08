<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
   {
    Schema::create('sales', function (Blueprint $table) {
        $table->id();
        $table->string('invoice_no')->unique();
        $table->foreignId('user_id')->constrained('users'); // Cashier ID[cite: 1]
        $table->foreignId('customer_id')->nullable()->constrained('customers');
        $table->decimal('total_amount', 10, 2);
        $table->decimal('discount', 10, 2)->default(0);
        $table->decimal('tax', 10, 2)->default(0);
        $table->decimal('net_total', 10, 2);
        $table->enum('payment_method', ['cash', 'card', 'qr']);
        $table->string('status')->default('completed');
        $table->timestamps();
    });
   }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
