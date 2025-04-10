<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Utils\Paginator;

class PaginatorTest extends TestCase
{
    public function test_that_page_has_correct_quantity_of_items(): void
    {
        $perPage = 5;
        $array = [1,2,3,4,5,6,7,8,9,10];
        $paginator = Paginator::paginate($array, $perPage);
        $this->assertEquals($paginator->count(), $perPage);
    }
    public function test_that_has_correct_quantity_of_pages(): void
    {
        $perPage = 5;
        $array = [1,2,3,4,5,6,7,8,9,10];
        $paginator = Paginator::paginate($array, $perPage);
        $this->assertEquals($paginator->lastPage(), count($array)/$perPage);
    }
}
