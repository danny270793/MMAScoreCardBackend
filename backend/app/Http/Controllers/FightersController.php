<?php

namespace App\Http\Controllers;

use App\Models\Fight;
use App\Models\Fighter;
use App\Models\Record;
use App\Models\Streak;
use App\Services\Sherdog;
use App\Http\Requests\FighterSearchRequest;
use Illuminate\Http\Request;

class FightersController extends Controller
{
    public function __construct(private readonly Sherdog $sherdog)
    {
    }

    public function index()
    {
        $fighters = Fighter::with('city')->orderBy('name', 'asc')->paginate(10);

        return response()
            ->json($fighters);
    }

    public function get($id)
    {
        $fighter = Fighter::with('city')->find($id);

        return response()
            ->json($fighter);
    }

    public function fightsByFighter($id)
    {
        $fights = Fight::where('fighter1_id', $id)
            ->orWhere('fighter2_id', $id)
            ->with('fighter1', 'fighter2', 'division', 'referee', 'event')
            ->join('events', 'fights.event_id', '=', 'events.id')
            ->orderBy('events.date', 'desc')
            ->paginate(10);

        return response()
            ->json($fights);
    }

    public function search(FighterSearchRequest $request)
    {
        $query = $request->input('query');
        $fighters = Fighter::with('city')
            ->where('name', 'LIKE', "%$query%")
            ->orWhere('nickname', 'LIKE', "%$query%")
            ->orWhere('country', 'LIKE', "%$query%")
            ->orWhere('city', 'LIKE', "%$query%")
            ->orWhere('weight', 'LIKE', "%$query%")
            ->paginate(10);

        return response()
            ->json($fighters);

    }

    public function streaks($id)
    {
        $streaks = Streak::where('fighter_id', $id)->get();

        return response()
            ->json($streaks);
    }

    public function records($id)
    {
        $records = Record::where('fighter_id', $id)->get();

        return response()
            ->json($records);
    }
}
