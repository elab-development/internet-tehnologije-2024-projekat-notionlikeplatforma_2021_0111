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
//rute za usera
Route::post('/register', [UserController::class, 'register']);  // registracija
Route::post('/login', [UserController::class, 'login'])->name('login');        // login
Route::post('/logout', [UserController::class, 'logout']);      // logout ulogovanog kor
Route::middleware('auth')->get('/me', [UserController::class, 'me']);
//middleware gleda da li je korisnik ulogovan
Route::middleware('auth')->group(function () {
    Route::put('/user', [UserController::class, 'update']);   // Update sopstveni profil
    Route::delete('/user', [UserController::class, 'delete']); // Delete sopstveni nalog
});
//rute za notes 
Route::middleware('auth')->group(function () {
    Route::get('/notes', [NoteController::class, 'index']);      // sve beleške korisnika
    Route::get('/notes/{id}', [NoteController::class, 'show']); // prikaz jedne beleške
    Route::post('/notes', [NoteController::class, 'store']);    // kreiranje nove
    Route::put('/notes/{id}', [NoteController::class, 'update']); // update
    Route::delete('/notes/{id}', [NoteController::class, 'destroy']); // brisanje
});
//rute za tasks
 /*
Route::middleware('auth')->group(function () {
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
});*/
Route::middleware('auth')->group(function () {
    // TodoList rute
    Route::get('/todolists', [TodoListController::class, 'index']);
    Route::post('/todolists', [TodoListController::class, 'store']);
    Route::get('/todolists/{id}', [TodoListController::class, 'show']);
    Route::put('/todolists/{id}', [TodoListController::class, 'update']);
    Route::delete('/todolists/{id}', [TodoListController::class, 'destroy']);

    // Taskovi vezani za todo listu
    Route::get('/todolists/{todolist}/tasks', [TaskController::class, 'index']); // prikaz svih taskova za listu
    Route::post('/todolists/{todolist}/tasks', [TaskController::class, 'store']); // kreiranje taska u listi

    // Pojedinačni taskovi
    Route::put('/tasks/{id}', [TaskController::class, 'update']); // update taska
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']); // brisanje taska
});
//rute za remindere
Route::middleware('auth')->group(function () {
    Route::get('/reminders', [ReminderController::class, 'index']);
    Route::post('/reminders', [ReminderController::class, 'store']);
    Route::get('/reminders/{id}', [ReminderController::class, 'show']);
    Route::put('/reminders/{id}', [ReminderController::class, 'update']);
    Route::delete('/reminders/{id}', [ReminderController::class, 'destroy']);
});
