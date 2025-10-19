<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reminder;
use Illuminate\Http\Request;
use App\Http\Resources\ReminderResource;

class ReminderController extends Controller
{
    // Sve reminder-e za trenutno ulogovanog korisnika
    /*public function index(Request $request)
    {
        return $request->user()->reminders()->with('task')->get();
    }*/
    public function index(Request $request)
{
    $reminders = $request->user()
        ->reminders()
        ->with('task')
        ->get();
       return ReminderResource::collection($reminders);

    }



    // Kreiranje novog remindera
    public function store(Request $request)
    {
        $validated=$request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'remind_at' => 'required|date',
            'task_id' => 'nullable|exists:tasks,id',
        ]);

        $reminder = auth()->user()->reminders()->create([
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'remind_at'   => $validated['remind_at'],
            'task_id'     => $validated['task_id'] ?? null,
        ]);

        return (new ReminderResource($reminder))
            ->additional(['message' => 'Reminder uspešno kreiran'])
            ->response()
            ->setStatusCode(201);
    }

public function show(Request $request, $id)
{
    $reminder = $request->user()
                        ->reminders()
                        ->with('task') 
                        ->findOrFail($id);

    return (new ReminderResource($reminder))
            ->additional(['message' => 'Reminder uspešno učitan']);
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
            ->response();
            //->setStatusCode(201);
   }

    // Brisanje remindera
    public function destroy(Request $request, $id)
    {
        $reminder = $request->user()->reminders()->findOrFail($id);
        $reminder->delete();

        return response()->json(['message' => 'Reminder obrisan']);
    }
    public function search(Request $request)
{
    $query = $request->input('q');
    $user = auth()->user();

    if (!$query) {
        return response()->json(['message' => 'Query parametar q je obavezan'], 400);
    }

    $reminders=$user->reminders()
    ->where(function ($queryBuilder) use ($query) {
        $queryBuilder->where('title', 'LIKE', "%{$query}%")
                     ->orWhere('description', 'LIKE', "%{$query}%");
    })
    ->with('task')
    ->get();

    return ReminderResource::collection($reminders);
}

}
