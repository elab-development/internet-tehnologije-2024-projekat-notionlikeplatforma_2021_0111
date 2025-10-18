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
Route::put('/user/reset-password', [UserController::class, 'resetPassword']);
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
    Route::get('/todolists/search', [ToDoListController::class, 'search']);
    Route::get('/todolists', [ToDoListController::class, 'index']);
    Route::post('/todolists', [ToDoListController::class, 'store']);
    Route::get('/todolists/{id}', [ToDoListController::class, 'show']);
    Route::put('/todolists/{id}', [ToDoListController::class, 'update']);
    Route::delete('/todolists/{id}', [ToDoListController::class, 'destroy']);
    

    // Taskovi vezani za todo listu
    Route::get('/todolists/{todolist}/tasks/search', [TaskController::class, 'search']);
    Route::get('/todolists/{todolist}/tasks/filter', [TaskController::class, 'filter']);
    Route::get('/todolists/{todolist}/tasks', [TaskController::class, 'index']); // prikaz svih taskova za listu
    Route::post('/todolists/{todolist}/tasks', [TaskController::class, 'store']); // kreiranje taska u listi

    // Pojedinačni taskovi
    Route::put('/todolists/{todolist}/tasks/{task}', [TaskController::class, 'update']); // update taska
    Route::delete('/todolists/{todolist}/tasks/{task}', [TaskController::class, 'destroy']);
    Route::get('/reminders/search', [ReminderController::class, 'search']);
    Route::get('/reminders', [ReminderController::class, 'index']);
    Route::post('/reminders', [ReminderController::class, 'store']);
    Route::get('/reminders/{id}', [ReminderController::class, 'show']);
    Route::put('/reminders/{id}', [ReminderController::class, 'update']);
    Route::delete('/reminders/{id}', [ReminderController::class, 'destroy']);
});
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'deleteUser']);
});

//rute za tasks
 /*
Route::middleware('auth')->group(function () {
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
});*/

