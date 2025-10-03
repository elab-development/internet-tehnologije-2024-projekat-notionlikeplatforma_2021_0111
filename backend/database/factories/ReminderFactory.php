<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reminder>
 */
class ReminderFactory extends Factory
{
    protected $model = \App\Models\Reminder::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'title' => $this->faker->sentence(2),
            'description' => $this->faker->paragraph(),
            'remind_at' => $this->faker->dateTimeBetween('now', '+1 week'),
            'user_id' => \App\Models\User::factory(),
            'task_id' => \App\Models\Task::factory(),
        ];
    }
}
