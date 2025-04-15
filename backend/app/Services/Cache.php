<?php

namespace App\Services;

abstract class Cache
{
    abstract public function get($key);

    abstract public function has($key);

    abstract public function put($key, $value);

    abstract public function remove($key);
}
