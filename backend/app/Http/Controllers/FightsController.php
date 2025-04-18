<?php

namespace App\Http\Controllers;

use App\Models\Fight;

class FightsController extends Controller
{
    public function index()
    {
        $fights = Fight::with('fighter1', 'fighter2', 'division', 'referee', 'event')
            ->paginate(10);

        return response()
            ->json($fights);
    }

    public function get($id)
    {
        $fight = Fight::with('fighter1', 'fighter2', 'division', 'referee', 'event')
            ->find($id);

        return response()
            ->json($fight);
    }
}
