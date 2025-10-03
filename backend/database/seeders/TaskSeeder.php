<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\ToDoList;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $todoLists = ToDoList::all();

        foreach ($todoLists as $list) {
            Task::factory(rand(2, 5))->create([
                'todo_list_id' => $list->id
            ]);
        }
    }
}
