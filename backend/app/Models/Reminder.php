<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'remind_at',
    ];
    //svaki reminder pripada jednom useru
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    //reminder moze biti vezan za neki task
    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
