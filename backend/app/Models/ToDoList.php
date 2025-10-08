<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToDoList extends Model
{
    use HasFactory;
     protected $table = 'todo_lists';
    protected $fillable = [
        'title',
        'description',
    ];

    // Svaka lista pripada jednom korisniku
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Lista može imati više taskova
    public function tasks()
    {
        return $this->hasMany(Task::class,'todo_list_id');
    }
}
