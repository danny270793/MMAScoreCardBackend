<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Fight;
use App\Utils\Paginator;

class EventsController extends Controller
{
    public function index()
    {
        $events = Event::orderBy('date', 'desc')->paginate(10);

        return response()
            ->json($events);
    }

    public function get($id)
    {
        $event = Event::find($id);

        return response()
            ->json($event);
    }

    public function fightsByEvent($id)
    {
        $fights = Fight::orderBy('position', 'desc')->where('event_id', $id)
            ->with('fighter1', 'fighter2', 'division', 'referee', 'event')
            ->paginate(10);

        return response()
            ->json($fights);
    }

    public function fightersByEvent($id)
    {
        $fights = Fight::where('event_id', $id)
            ->with('fighter1', 'fighter2', 'division', 'referee')
            ->paginate(10);

        $fighters = [];

        foreach ($fights as $fight) {
            $alreadyExists = false;
            foreach ($fighters as $fighter) {
                if ($fighter->id === $fight->fighter1->id || $fighter->id === $fight->fighter2->id) {
                    $alreadyExists = true;
                    break;
                }
            }
            if (! $alreadyExists) {
                $fighters[] = $fight->fighter1;
                $fighters[] = $fight->fighter2;
            }
        }

        $paginator = Paginator::paginate($fighters);

        return response()
            ->json($paginator);
    }
}
