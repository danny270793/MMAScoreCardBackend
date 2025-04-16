<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Record extends Model
{
    protected $fillable = [
        'name',
        'value',
        'fighter_id',
    ];

    public function fighter(): BelongsTo
    {
        return $this->belongsTo(Fighter::class, 'fighter_id');
    }
}
