<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Task;
use App\Models\ToDoList;
use App\Http\Resources\TaskResource;

class TaskController extends Controller
{/*
    // prikaz svih zadataka trenutno ulogovanog korisnika
    public function index(Request $request)
    {
        $tasks = $request->user()->tasks()->get();
        return response()->json($tasks);
    }

    // kreiranje novog zadatka
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:pending,done',
            'due_date' => 'nullable|date',
        ]);

        $task = $request->user()->tasks()->create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'pending',
            'due_date' => $request->due_date,
        ]);

        return response()->json([
            'message' => 'Task uspešno kreiran',
            'task' => $task
        ], 201);
    }

    // update zadatka
    public function update(Request $request, $id)
    {
        $task = $request->user()->tasks()->findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'status' => 'sometimes|in:pending,done',
            'due_date' => 'sometimes|date',
        ]);

        $task->update($request->only(['title', 'description', 'status', 'due_date']));

        return response()->json([
            'message' => 'Task uspešno ažuriran',
            'task' => $task
        ]);
    }

    // delete zadatka
    public function destroy($id)
    {
        $task = $request->user()->tasks()->findOrFail($id);
        $task->delete();

        return response()->json([
            'message' => 'Task uspešno obrisan'
        ]);
    }*/
         public function index(TodoList $todolist)
    {
        // Provera da li trenutni korisnik ima pristup listi
        if ($todolist->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return TaskResource::collection($todolist->tasks);
    }

    // Kreiranje taska u određenoj todo listi
    public function store(Request $request, TodoList $todolist)
    {
        if ($todolist->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated=$request->validate([
            'title' => 'required|string|max:255',
            'details' => 'nullable|string',
            'status' => 'nullable|in:pending,done',
            'due_date' => 'nullable|date',
        ]);

        $task = $todolist->tasks()->create([
            'title'   => $validated['title'],
            'details' => $validated['details'] ?? null,
            'status'  => $validated['status'] ?? 'pending',
            'due_date'=> $validated['due_date'] ?? null,
        ]);

        return (new TaskResource($task))
            ->additional(['message' => 'Task uspešno kreiran'])
            ->response()
            ->setStatusCode(201);
    }

    // Update taska u okviru todo liste korisnika
    public function update(Request $request, TodoList $todolist, $taskId)
    {
        if ($todolist->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // vraca task iz odredjene liste
        $task = $todolist->tasks()->findOrFail($taskId);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'details' => 'sometimes|string',
            'status' => 'sometimes|in:pending,done',
            'due_date' => 'sometimes|date',
        ]);

         $task->update($validated);
         return new TaskResource($task);
    }

    // Brisanje taska u okviru todo liste
    public function destroy(TodoList $todolist, $taskId)
    {
        if ($todolist->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task = $todolist->tasks()->findOrFail($taskId);
        $task->delete();

        return response()->json(['message' => 'Task uspešno obrisan']);
    }
}


