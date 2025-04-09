<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Division;
use App\Models\Fight;
use App\Utils\Paginator;

class DivisionsController extends Controller
{
    function index()
    {
        $divisions = Division::paginate(10);
        return response()
            ->json($divisions);
    }
    function get($id)
    {
        $division = Division::find($id);
        return response()
            ->json($division);
    }
    function fightsByDivision($id)
    {
        $fights = Fight::where('division_id', $id)
            ->with('fighter1', 'fighter2', 'division', 'referee')
            ->paginate(10);
        return response()
            ->json($fights);
    }
    function fightersByDivision($id)
    {
        $fights = Fight::where('division_id', $id)
            ->with('fighter1', 'fighter2', 'division', 'referee')
            ->paginate(10);

        $fighters = [];

        foreach ($fights as $fight) {
            $alreadyExists = false;
            foreach ($fighters as $fighter) {
                if ($fighter->id == $fight->fighter1->id || $fighter->id == $fight->fighter2->id) {
                    $alreadyExists = true;
                    break;
                }
            }
            if(!$alreadyExists) {
                $fighters[] = $fight->fighter1;
                $fighters[] = $fight->fighter2;
            }
        }

        $paginator = Paginator::paginate($fighters);

        return response()
            ->json($paginator);
    }
}
