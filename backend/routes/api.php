<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\ToDoListController;
use App\Http\Controllers\Api\ReminderController;

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
Route::post('/register', [UserController::class, 'register']);  // registracija
Route::post('/login', [UserController::class, 'login'])->name('login');        // login

//rute za usera

//middleware gleda da li je korisnik ulogovan
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'me']);
    Route::post('/logout', [UserController::class, 'logout']);
    Route::put('/user', [UserController::class, 'update']);   // Update sopstveni profil
    Route::delete('/user', [UserController::class, 'delete']); // Delete sopstveni nalog
    Route::get('/notes/search', [NoteController::class, 'search']);
    Route::get('/notes/filter', [NoteController::class, 'filter']);
    Route::get('/notes/paginate', [NoteController::class, 'paginate']);
    Route::apiResource('notes', NoteController::class);
    
    // TodoList rute
    Route::get('/todolists', [ToDoListController::class, 'index']);
    Route::post('/todolists', [ToDoListController::class, 'store']);
    Route::get('/todolists/{id}', [ToDoListController::class, 'show']);
    Route::put('/todolists/{id}', [ToDoListController::class, 'update']);
    Route::delete('/todolists/{id}', [ToDoListController::class, 'destroy']);

    // Taskovi vezani za todo listu
    Route::get('/todolists/{todolist}/tasks', [TaskController::class, 'index']); // prikaz svih taskova za listu
    Route::post('/todolists/{todolist}/tasks', [TaskController::class, 'store']); // kreiranje taska u listi

    // Pojedinačni taskovi
    Route::put('/todolists/{todolist}/tasks/{task}', [TaskController::class, 'update']); // update taska
    Route::delete('/todolists/{todolist}/tasks/{task}', [TaskController::class, 'destroy']); // brisanje taska
    Route::get('/reminders', [ReminderController::class, 'index']);
    Route::post('/reminders', [ReminderController::class, 'store']);
    Route::get('/reminders/{id}', [ReminderController::class, 'show']);
    Route::put('/reminders/{id}', [ReminderController::class, 'update']);
    Route::delete('/reminders/{id}', [ReminderController::class, 'destroy']);
});

//rute za tasks
 /*
Route::middleware('auth')->group(function () {
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
});*/

