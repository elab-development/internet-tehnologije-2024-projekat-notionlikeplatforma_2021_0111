<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ToDoList;
use App\Http\Resources\ToDoListResource;

class ToDoListController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //vraca sve todoliste zajedno sa pripadajucim taskovima
        $lists = ToDoList::where('user_id', auth()->id())
        ->with('tasks')
        ->get();

        return ToDoListResource::collection($lists);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $list = $request->user()->todoLists()->create([
        'title' => $validated['title'],
        'description' => $validated['description'] ?? null,
    ]);
    return (new ToDoListResource($list))
            ->additional(['message' => 'To-do lista uspešno kreirana'])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $list = auth()->user()->todoLists()->with('tasks')->findOrFail($id);
        return new ToDoListResource($list);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
         $list = auth()->user()->todoLists()->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
        ]);

        $list->update($validated);
        return (new ToDoListResource($list))
                ->additional(['message' => 'To-do lista je uspešno ažurirana']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
    $user = auth()->user();
    $list = $user->todoLists()->findOrFail($id);

    \DB::beginTransaction();
    try {
        // prvo brise sve remindere koji su vezani za taskove u ovoj listi
        \DB::table('reminders')
            ->whereIn('task_id', function ($query) use ($list) {
                $query->select('id')
                      ->from('tasks')
                      ->where('todo_list_id', $list->id);
            })
            ->delete();

        // zatim brise sve taskove iz liste
        \DB::table('tasks')->where('todo_list_id', $list->id)->delete();

        // na kraju brise samu listu
        $list->delete();

        \DB::commit();

        return response()->json(['message' => 'Lista i svi povezani podaci su uspešno obrisani.']);
    } catch (\Exception $e) {
        \DB::rollBack();
        return response()->json(['message' => 'Greška pri brisanju liste: ' . $e->getMessage()], 500);
    }
}
    
    public function search(Request $request)
{
    $query = $request->input('q');
    $user = auth()->user();

    if (!$user) {
        return response()->json(['message' => 'Niste ulogovani!'], 401);
    }

    if (!$query) {
        return response()->json(['message' => 'Query parametar q je obavezan'], 400);
    }

    $todolists = $user->todoLists()
    ->where(function ($queryBuilder) use ($query) {
        $queryBuilder->where('title', 'LIKE', "%{$query}%")
                     ->orWhere('description', 'LIKE', "%{$query}%");
    })
    ->with('tasks')
    ->get();

    return ToDoListResource::collection($todolists);
}

public function stats() {
    $userId = auth()->id();

    $todosCount = \DB::table('todo_lists')->where('user_id', $userId)->count();

    $tasks = \DB::table('tasks')
        ->join('todo_lists', 'tasks.todo_list_id', '=', 'todo_lists.id')
        ->where('todo_lists.user_id', $userId)
        ->select('tasks.status')
        ->get();

    $done = $tasks->where('status', 'done')->count();
    $pending = $tasks->where('status', 'pending')->count();

    return response()->json([
        'todosCount' => $todosCount,
        'done' => $done,
        'pending' => $pending,
    ]);
}


}
