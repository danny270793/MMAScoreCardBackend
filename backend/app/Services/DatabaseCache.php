<?php

namespace App\Services;

use App\Services\Cache as Cacheable;
use App\Models\Cache;

class DatabaseCache extends Cacheable
{

    public function get($key)
    {
        $cache = Cache::where('key', $key)->first();
        return $cache->value;
    }

    public function has($key)
    {
        $cache = Cache::where('key', $key)->first();
        return $cache !== null;
    }

    public function put($key, $value)
    {
        $cache = Cache::where('key', $key)->first();
        if($cache == null)
        {
            $cache = new Cache();
        }
        $cache->key = $key;
        $cache->value = $value;
        $cache->save();
    }
}