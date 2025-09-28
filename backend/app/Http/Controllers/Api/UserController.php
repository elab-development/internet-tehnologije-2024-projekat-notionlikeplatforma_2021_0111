<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

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
$token = $user->createToken('api-token')->plainTextToken;

return response()->json([
    'message' => 'Uspešno ulogovan',
    'token' => $token,
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
public function me(Request $request)
{
    return response()->json($request->user());
}
public function update(Request $request)
    {
        $user = $request->user(); // trenutno ulogovani korisnik

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes','email', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|string|min:6',
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'Profil uspešno ažuriran',
            'user' => $user
        ]);
    }
    public function delete(Request $request)
    {
        $user = $request->user(); // trenutno ulogovani korisnik
        $user->delete();

        return response()->json([
            'message' => 'Nalog je uspešno obrisan'
        ]);
    }
}
