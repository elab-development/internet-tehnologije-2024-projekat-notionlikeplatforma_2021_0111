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
        /*$list = auth()->user()->todoLists()->with('tasks')->findOrFail($id);
        return response()->json($list);*/
         $list = TodoList::findOrFail($id);
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
        $list = auth()->user()->todoLists()->findOrFail($id);
        $list->delete();

        return response()->json([
            'message' => 'To-do lista uspešno obrisana'
        ]);
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
}
