<?php

namespace App\Utils;

use Illuminate\Pagination\LengthAwarePaginator;

class Paginator
{
    public static function paginate($items, $perPage = 10)
    {
        $page = LengthAwarePaginator::resolveCurrentPage();
        $currentItems = array_slice($items, ($page - 1) * $perPage, $perPage);

        return new LengthAwarePaginator(
            $currentItems,
            count($items),
            $perPage,
            $page,
            ['path' => LengthAwarePaginator::resolveCurrentPath()]
        );
    }
}
