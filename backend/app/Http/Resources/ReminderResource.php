<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ReminderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'remind_at'   => $this->remind_at,
            'task' => new TaskResource($this->whenLoaded('task')),
            //'user_id'     => $this->user_id,
            //'task_id'     => $this->task_id,

        ];
    }
}
