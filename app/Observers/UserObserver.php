<?php

namespace App\Observers;

use App\Models\User;
use App\Modules\ACL\Models\Role;

class UserObserver
{
    public function creating(User $user)
    {
    }

    /**
     * Handle the User "creating" event.
     */
    public function created(User $user): void
    {
        $user->roles()->attach(Role::user()->first());
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        dd('oi');
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        //
    }
}
