<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Fighter extends Model
{
    protected $fillable = [
        'name',
        'link',
        'nickname',
        'city_id',
        'birthday',
        'died',
        'height',
        'weight',
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
        return $this->hasMany(Fight::class, 'fighter1_id');
    }
}
