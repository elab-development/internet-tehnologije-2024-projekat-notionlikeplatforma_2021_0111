<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reminder;
use Illuminate\Http\Request;

class ReminderController extends Controller
{
    // Sve reminder-e za trenutno ulogovanog korisnika
    public function index(Request $request)
    {
        return $request->user()->reminders()->with('task')->get();
    }

    // Kreiranje novog remindera
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'remind_at' => 'required|date',
            'task_id' => 'nullable|exists:tasks,id',
        ]);

        $reminder = $request->user()->reminders()->create([
            'title' => $request->title,
            'remind_at' => $request->remind_at,
            'task_id' => $request->task_id, // ako se vezuje za task
        ]);

        return response()->json([
            'message' => 'Reminder uspešno kreiran',
            'reminder' => $reminder
        ], 201);
    }

    // Prikaz jednog remindera
    public function show(Request $request, $id)
    {
        $reminder = $request->user()->reminders()->findOrFail($id);
        return response()->json($reminder);
    }

    // Update remindera
    public function update(Request $request, $id)
    {
        $reminder = $request->user()->reminders()->findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'remind_at' => 'sometimes|date',
            'task_id' => 'nullable|exists:tasks,id',
        ]);

        $reminder->update($request->only(['title', 'remind_at', 'task_id']));

        return response()->json([
            'message' => 'Reminder uspešno ažuriran',
            'reminder' => $reminder
        ]);
    }

    // Brisanje remindera
    public function destroy(Request $request, $id)
    {
        $reminder = $request->user()->reminders()->findOrFail($id);
        $reminder->delete();

        return response()->json(['message' => 'Reminder obrisan']);
    }
}
