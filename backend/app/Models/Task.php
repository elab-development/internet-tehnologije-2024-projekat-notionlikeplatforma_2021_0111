<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'details',
        'status',
        'due_date',
    ];

    public function todolist()
    {
        return $this->belongsTo(ToDoList::class,'todo_list_id');
    }
}
