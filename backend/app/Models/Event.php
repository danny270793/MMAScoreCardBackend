<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    protected $fillable = [
        'name',
        'fight',
        'location',
        'city_id',
        'date',
        'link',
        'state',
    ];

    protected $hidden = [
        'link',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function fights(): HasMany
    {
        return $this->hasMany(Fight::class);
    }
}
