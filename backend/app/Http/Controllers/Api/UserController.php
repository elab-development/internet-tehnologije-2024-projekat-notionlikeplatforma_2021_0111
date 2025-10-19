<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use App\Http\Resources\UserResource;

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

        return (new UserResource($user))
            ->additional(['message' => 'Korisnik uspešno registrovan']);
    }

    // Login
    public function login(Request $request)
{
     \Log::info($request->all()); 
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

return (new UserResource($user))
            ->additional([
                'message' => 'Uspešno ulogovan',
                'token'   => $token,
            ]);
}
public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete(); // briše trenutni token

    return response()->json([
        'message' => 'Uspešno odjavljen'
    ]);
}
public function me(Request $request)
{
    return (new UserResource($request->user()))
    ->additional(['message' => 'Podaci o Vašem profilu']);
}
public function index()
{
    $currentUserId = auth()->id(); // uzmi id trenutno ulogovanog korisnika

    $users = User::where('id', '!=', $currentUserId)->get(); // svi osim sebe


    return response()->json([
        'message' => 'Uspesno ucitani svi korisnici',
        'data' => $users
    ]);
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

        return (new UserResource($user))
            ->additional(['message' => 'Profil uspešno ažuriran']);
    }
    public function delete(Request $request)
    {
        $user = $request->user(); // trenutno ulogovani korisnik
        $user->delete();

        return response()->json([
            'message' => 'Nalog je uspešno obrisan'
        ]);
    }
    public function deleteUser($id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json([
            'message' => 'Korisnik nije pronađen.'
        ], 404);
    }

    if ($user->id === auth()->id()) {
        return response()->json([
            'message' => 'Admin ne sme obrisati sopstveni nalog.'
        ], 403);
    }

    $user->delete();

    return response()->json([
        'message' => 'Korisnik je uspešno obrisan.'
    ]);
}
public function resetPassword(Request $request)
{
    $request->validate([
        'email' => 'required|email|exists:users,email',
        'password' => 'required|string|min:6',
    ]);

    $user = User::where('email', $request->email)->first();
    $user->password = Hash::make($request->password);
    $user->save();

    return response()->json(['message' => 'Password successfully updated.']);
}


}
