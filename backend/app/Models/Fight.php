<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Fight extends Model
{
    protected $fillable = [
        'position',
        'event_id',
        'fighter1_id',
        'fighter1_result',
        'fighter2_id',
        'fighter2_result',
        'division_id',
        'method',
        'method_detail',
        'referee_id',
        'round',
        'time',
        'state',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function fighter1(): BelongsTo
    {
        return $this->belongsTo(Fighter::class, 'fighter1_id');
    }

    public function fighter2(): BelongsTo
    {
        return $this->belongsTo(Fighter::class, 'fighter2_id');
    }

    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    public function referee(): BelongsTo
    {
        return $this->belongsTo(Referee::class);
    }
}
