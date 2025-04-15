<?php

namespace App\Http\Controllers;

use App\Models\Fight;
use App\Models\Fighter;
use App\Models\Streak;
use App\Services\Sherdog;
use Illuminate\Http\Request;

class FightersController extends Controller
{
    private $sherdog;

    public function __construct(Sherdog $sherdog)
    {
        $this->sherdog = $sherdog;
    }

    public function index()
    {
        $fighters = Fighter::paginate(10);

        return response()
            ->json($fighters);
    }

    public function get($id)
    {
        $fighter = Fighter::find($id);

        return response()
            ->json($fighter);
    }

    public function fightsByFighter($id)
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

    public function search(Request $request)
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

    public function stats($id)
    {
        $streaks = Streak::where('fighter_id', $id)->get();

        return response()
            ->json($streaks);
    }
}
