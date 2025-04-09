<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\FileCache;
use App\Models\Cache;

class SherdogCacheLoad extends Command
{
    protected $signature = 'sherdog:cache:load';

    protected $description = 'Command description';

    public function handle()
    {
        $fileCache = new FileCache();
        $keys = $fileCache->keys();
        $bar = $this->output->createProgressBar(count($keys));
        $bar->start();

        foreach($keys as $key)
        {
            $value = $fileCache->get($key);
            $cache = Cache::where('key', $key)->first();
            if($cache == null)
            {
                $cache = new Cache();
                $cache->key = $key;
            }
            $cache->value = $value;
            $cache->save();
            
            $bar->advance();
        }
        
        $bar->finish();
    }
}
