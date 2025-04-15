<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Streak extends Model
{
    protected $fillable = [
        'result',
        'counter',
        'from',
        'to',
        'fighter_id'
    ];

    public function fighter(): BelongsTo
    {
        return $this->belongsTo(Fighter::class, 'fighter_id');
    }
}
