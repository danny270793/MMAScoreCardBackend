<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class FileCache
{
    private $path = 'app/cache.json';

    private $data = [];

    public function __construct()
    {
        ini_set('memory_limit', '2560M');

        $filePath = storage_path($this->path);
        if (! File::exists($filePath)) {
            return;
        }
        $jsonData = File::get($filePath);
        $this->data = json_decode($jsonData, true);
    }

    public function get($key)
    {
        return $this->data[$key] ?? null;
    }

    public function keys()
    {
        return array_keys($this->data);
    }

    public function has($key)
    {
        $value = $this->get($key);

        return $value !== null;
    }

    public function put($key, $value)
    {
        $filePath = storage_path($this->path);
        Log::info("saving $key in $filePath");
        if (! File::exists($filePath)) {
            File::put($filePath, json_encode([]));
        }

        $jsonData = File::get($filePath);
        $cached = json_decode($jsonData, true);
        $cached[$key] = $value;
        $jsonCached = json_encode($cached);
        File::put($filePath, $jsonCached);
    }
}
