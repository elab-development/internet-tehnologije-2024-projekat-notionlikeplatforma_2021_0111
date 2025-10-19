<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Task;
use App\Models\ToDoList;
use App\Http\Resources\TaskResource;

class TaskController extends Controller
{
         public function index(ToDoList $todolist)
    {
        // Provera da li trenutni korisnik ima pristup listi
        if ($todolist->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return TaskResource::collection($todolist->tasks);
    }

    // Kreiranje taska u određenoj todo listi
    public function store(Request $request, ToDoList $todolist)
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
    public function update(Request $request, ToDoList $todolist, $taskId)
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
    public function destroy(ToDoList $todolist, $taskId)
    {
        if ($todolist->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task = $todolist->tasks()->findOrFail($taskId);
        $task->delete();

        return response()->json(['message' => 'Task uspešno obrisan']);
    }
    public function search(Request $request, $id)
{
    $query = $request->input('q');
    $user = auth()->user();

    if (!$query) {
        return response()->json(['message' => 'Query parametar q je obavezan'], 400);
    }

    // Pronadji to-do listu samo ako pripada ulogovanom korisniku
    $todoList = $user->todoLists()->findOrFail($id);

    // Pretrazi taskove unutar te liste
    $tasks = $todoList->tasks()
        ->where(function ($queryBuilder) use ($query) {
            $queryBuilder->where('title', 'LIKE', "%{$query}%")
                         ->orWhere('details', 'LIKE', "%{$query}%");
        })
        ->get();

    return TaskResource::collection($tasks);
}
public function filter(Request $request, ToDoList $todolist)
{
    $status = $request->input('status'); // pending ili done

    if (!$status) {
        return response()->json(['message' => 'Parametar status je obavezan.'], 400);
    }
//validacija
    if (!in_array($status, ['pending', 'done'])) {
        return response()->json(['message' => 'Status mora biti pending ili done.'], 400);
    }

    $tasks = $todolist->tasks()
        ->where('status', $status)
        ->get();

    return TaskResource::collection($tasks);
}
}


