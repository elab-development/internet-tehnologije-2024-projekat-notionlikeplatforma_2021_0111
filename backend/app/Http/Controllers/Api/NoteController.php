<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\NoteResource;

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
        return NoteResource::collection($notes);
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
        return (new NoteResource($note))
            ->additional(['message' => 'Beleška uspešno kreirana'])
            ->response()
            ->setStatusCode(201);
       /* return response()->json([
            'message' => 'Beleška uspešno kreirana',
            'note' => $note
        ], 201);*/
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
        return new NoteResource($note);
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

        return (new NoteResource($note))
            ->additional(['message' => 'Beleška uspešno ažurirana']);
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

  /*  public function search(Request $request)
{
    $query = $request->input('q');

    if (!$query) {
        return response()->json(['message' => 'Query parametar q je obavezan'], 400);
    }

    $notes = auth()->user()->notes()
        ->where('title', 'LIKE', "%{$query}%")
        ->get();

    return response()->json($notes);
}*/

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

    $notes = $user->notes()
    ->where(function ($queryBuilder) use ($query) {
        $queryBuilder->where('title', 'LIKE', "%{$query}%")
                     ->orWhere('content', 'LIKE', "%{$query}%");
    })
    ->get();

    return NoteResource::collection($notes);
}




/*
    $userId = $request->input('user_id'); // filter po korisniku
    $date = $request->input('date'); // filter po datumu

    $notes = Note::query();

    if ($userId) {
        $notes->where('user_id', $userId);
    }
    if ($date) {
        $notes->whereDate('created_at', $date);
    }

    /*return response()->json($notes->get());*/
    //return NoteResource::collection($notes);*/public function filter(Request $request)

public function filter(Request $request)
{
    $user =  auth()->user();
    $from = $request->input('from');
    $to = $request->input('to');

    $query = Note::where('user_id', $user->id);

    if ($from && $to) {
        $query->whereBetween('created_at', [$from, $to]);
    } elseif ($from) {
        $query->whereDate('created_at', '>=', $from);
    } elseif ($to) {
        $query->whereDate('created_at', '<=', $to);
    }

    $notes = $query->orderBy('created_at', 'desc')->get();
    return NoteResource::collection($notes);
}

public function paginate(Request $request)
{
    $perPage = $request->input('per_page', 2); // broj beleški po stranici
    $user = auth()->user();

    // Beleške samo ulogovanog korisnika
    $notes = $user->notes()->paginate($perPage);

    return NoteResource::collection($notes);
}

}
