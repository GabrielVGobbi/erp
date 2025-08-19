<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApprovalAssignmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => new UserResource($this->whenLoaded('user')),
            'role' => [
                'id' => $this->whenLoaded('role', fn() => $this->role->id),
                'name' => $this->whenLoaded('role', fn() => $this->role->name),
                'slug' => $this->whenLoaded('role', fn() => $this->role->slug),
            ],

            'user_id' => $this->user->id,
            'role_id' => $this->role->id,
        ];
    }
}
