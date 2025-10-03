<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reminder;
use Illuminate\Http\Request;
use App\Http\Resources\ReminderResource;

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
            'description' => 'nullable|string',
            'remind_at' => 'required|date',
            'task_id' => 'nullable|exists:tasks,id',
        ]);

        $reminder = Reminder::create([
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'remind_at'   => $validated['remind_at'],
            'task_id'     => $validated['task_id'] ?? null,
            'user_id'     => auth()->id(),
        ]);

        return (new ReminderResource($reminder))
            ->additional(['message' => 'Reminder uspešno kreiran'])
            ->response()
            ->setStatusCode(201);
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

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'remind_at'   => 'sometimes|date|after:now',
            'task_id'     => 'sometimes|exists:tasks,id',
        ]);

        $reminder->update($validated);
        return (new ReminderResource($reminder))
            ->additional(['message' => 'Reminder uspešno ažuriran'])
            ->response()
            ->setStatusCode(201);
   }

    // Brisanje remindera
    public function destroy(Request $request, $id)
    {
        $reminder = $request->user()->reminders()->findOrFail($id);
        $reminder->delete();

        return response()->json(['message' => 'Reminder obrisan']);
    }
}
