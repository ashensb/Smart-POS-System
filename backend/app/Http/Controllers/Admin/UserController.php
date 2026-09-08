<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // සියලුම Users / Customers ලැයිස්තුව ලබාගැනීම
    public function index()
    {
        $users = User::latest()->get();
        return response()->json($users);
    }

    // Admin විසින් අලුතින් Staff/Admin එකතු කිරීම
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required|in:admin,cashier,customer',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => 'active',
        ]);

        return response()->json($user, 201);
    }

    // User Status වෙනස් කිරීම (Active / Blocked)
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        $user->status = ($user->status === 'active') ? 'blocked' : 'active';
        $user->save();

        return response()->json([
            'message' => 'User status updated successfully',
            'status' => $user->status
        ]);
    }

    // User කෙනෙකු ඉවත් කිරීම
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Admin account එක delete වීම වැළැක්වීමට
        if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            return response()->json(['message' => 'Cannot delete the only admin user.'], 400);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}