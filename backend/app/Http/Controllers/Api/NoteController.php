<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\User;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(/*Request $request*/)
    {
        /*$request->validate([
        'user_id' => 'required|exists:users,id', // traži da pošalješ user_id
    ]);

    $user = User::find($request->user_id);

    if (!$user) {
        return response()->json(['message' => 'Korisnik nije pronađen'], 404);
    }*/
        $notes = auth()->user()->notes()->get();
        return response()->json($notes);
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
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
        ]);

        $note = auth()->user()->notes()->create([
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json([
            'message' => 'Beleška uspešno kreirana',
            'note' => $note
        ], 201);
    }
      /*  public function store(Request $request)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'nullable|string',
        'user_id' => 'required|exists:users,id', // traži da pošalješ user_id
    ]);

    $user = User::find($request->user_id);

    if (!$user) {
        return response()->json(['message' => 'Korisnik nije pronađen'], 404);
    }

    $note = $user->notes()->create([
        'title' => $request->title,
        'content' => $request->content,
    ]);

    return response()->json([
        'message' => 'Beleška uspešno kreirana',
        'note' => $note
    ], 201);
}*/


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $note = auth()->user()->notes()->findOrFail($id);
        return response()->json($note);
    }

    /*
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
        $note = auth()->user()->notes()->findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
        ]);

        $note->update($request->only(['title', 'content']));

        return response()->json([
            'message' => 'Beleška uspešno ažurirana',
            'note' => $note
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(/*Request $request,*/$id)
    {
       /* $request->validate([
        'user_id' => 'required|exists:users,id', // traži da pošalješ user_id
    ]);

    $user = User::find($request->user_id);*/
        $note = auth()->user()->notes()->findOrFail($id);
        $note->delete();

        return response()->json([
            'message' => 'Beleška uspešno obrisana'
        ]);
    }
}
