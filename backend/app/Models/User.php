<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // 1. Import එක එකතු කරන්න

class User extends Authenticatable
{
    use HasApiTokens, Notifiable; // 2. මෙතැනට HasApiTokens එකතු කරන්න

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}