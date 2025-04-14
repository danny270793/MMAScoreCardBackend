<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Fighter;
use App\Models\Fight;

class FightersController extends Controller
{
    function index()
    {
        $fighters = Fighter::paginate(10);
        return response()
            ->json($fighters);
    }
    function get($id)
    {
        $fighter = Fighter::find($id);
        return response()
            ->json($fighter);
    }
    function fightsByFighter($id)
    {
        $fights = Fight::where('fighter1_id', $id)
            ->orWhere('fighter2_id', $id)
            ->with('fighter1', 'fighter2', 'division', 'referee')
            ->join('events', 'fights.event_id', '=', 'events.id')
            ->orderBy('events.date', 'desc')
            ->paginate(10);
        return response()
            ->json($fights);
    }
    function search(Request $request)
    {
        $query = $request->input('query');
        $fighters = Fighter::where('name', 'LIKE', "%$query%")
            ->orWhere('nickname', 'LIKE', "%$query%")
            ->orWhere('country', 'LIKE', "%$query%")
            ->orWhere('city', 'LIKE', "%$query%")
            ->orWhere('weight', 'LIKE', "%$query%")
            ->paginate(10);
        return response()
            ->json($fighters);

    }
}
