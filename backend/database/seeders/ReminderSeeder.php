<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Task;
use App\Models\Reminder;

class ReminderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::all();
        $tasks = Task::all();

        foreach ($users as $user) {
            // random reminder koji nije vezan za task
            Reminder::factory(rand(1,2))->create([
                'user_id' => $user->id,
                'task_id' => null
            ]);
        }

        foreach ($tasks as $task) {
            // reminder vezan za task
            Reminder::factory(rand(0,1))->create([
                'user_id' => $task->todolist->user_id,
                'task_id' => $task->id
            ]);
        }
    }
}
