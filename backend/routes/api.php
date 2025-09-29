<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\NoteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/register', [UserController::class, 'register']);  // registracija
Route::post('/login', [UserController::class, 'login'])->name('login');        // login
Route::post('/logout', [UserController::class, 'logout']);      // logout ulogovanog kor
Route::middleware('auth')->get('/me', [UserController::class, 'me']);
//middleware gleda da li je korisnik ulogovan
Route::middleware('auth')->group(function () {
    Route::put('/user', [UserController::class, 'update']);   // Update sopstveni profil
    Route::delete('/user', [UserController::class, 'delete']); // Delete sopstveni nalog
});
Route::middleware('auth')->group(function () {
    Route::get('/notes', [NoteController::class, 'index']);      // sve beleške korisnika
    Route::get('/notes/{id}', [NoteController::class, 'show']); // prikaz jedne beleške
    Route::post('/notes', [NoteController::class, 'store']);    // kreiranje nove
    Route::put('/notes/{id}', [NoteController::class, 'update']); // update
    Route::delete('/notes/{id}', [NoteController::class, 'destroy']); // brisanje
});