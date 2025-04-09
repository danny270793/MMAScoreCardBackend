<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Fight;

class FightsController extends Controller
{
    function index()
    {
        $fights = Fight::with('fighter1', 'fighter2', 'division', 'referee')
            ->paginate(10);
        return response()
            ->json($fights);
    }
    function get($id)
    {
        $fight = Fight::with('fighter1', 'fighter2', 'division', 'referee')
            ->find($id);
        return response()
            ->json($fight);
    }
}
