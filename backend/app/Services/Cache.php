<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

abstract class Cache
{
    public abstract function get($key);

    public abstract function has($key);

    public abstract function put($key, $value);
}