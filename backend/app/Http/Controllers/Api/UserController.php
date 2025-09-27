<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //registracija korisnika 
     public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            // role može biti optional, podrazumevano 'user'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'user',
        ]);

        return response()->json([
            'message' => 'Korisnik uspešno registrovan',
            'user' => $user
        ], 201);
    }

    // Login
    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    $credentials = $request->only('email', 'password');

    if (!Auth::attempt($credentials)) {
        throw ValidationException::withMessages([
            'email' => ['Podaci za prijavu nisu ispravni.'],
        ]);
    }

    $user = Auth::user();

    return response()->json([
        'message' => 'Uspešno ulogovan',
        'user' => $user
    ]);
}
public function logout(Request $request)
{
    Auth::logout();

    return response()->json([
        'message' => 'Uspešno odjavljen'
    ]);
}

}
