<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\Sherdog;
use App\Models\Event;
use App\Models\Referee;
use App\Models\Division;
use App\Models\Fighter;
use App\Models\Fight;

class RefreshEvents extends Command
{
    protected $signature = 'sherdog:refresh';

    protected $description = 'Refresh the events from Sherdog';

    public function createEvents(Sherdog $sherdog)
    {
        // $events = $sherdog->getEvents();
        // $eventsCount = count($events);
        // $this->info("Found $eventsCount events");
        // foreach ($events as $eachEvent)
        // {
        //     $event = Event::where('name', $eachEvent['name'])->first();
        //     if($event == null)
        //     {
        //         $event = new Event();
        //     }

        //     $event->name = $eachEvent['name'];
        //     $event->fight = $eachEvent['fight'];
        //     $event->location = $eachEvent['location'];
        //     $event->country = $eachEvent['country'];
        //     $event->date = $eachEvent['date'];
        //     $event->link = $eachEvent['link'];
        //     $event->save();
        // }

        $this->info("Getting events");
        $sherdog->executeOnEachEvent(function($eachEvent) {
            $event = Event::where('name', $eachEvent['name'])->first();
            if($event == null)
            {
                $event = new Event();
            }

            $event->name = $eachEvent['name'];
            $event->fight = $eachEvent['fight'];
            $event->location = $eachEvent['location'];
            $event->country = $eachEvent['country'];
            $event->date = $eachEvent['date'];
            $event->link = $eachEvent['link'];
            $event->save();
        });
        $this->withProgressBar(Event::all(), function ($event) {});
        $this->newLine();
        $this->comment(Event::count() . " events on database");
    }

    public function createReferees(Sherdog $sherdog)
    {
        // $referees = $sherdog->getReferees();
        // $refereeCount = count($referees);
        // $this->info("Found $refereeCount referees");
        // foreach ($referees as $eachReferee)
        // {
        //     $referee = Referee::where('name', $eachReferee['name'])->first();
        //     if($referee == null)
        //     {
        //         $referee = new Referee();
        //     }

        //     $referee->name = $eachReferee['name'];
        //     $referee->save();
        // }

        $this->info("Getting referees");
        $this->withProgressBar(Event::all(), function ($event) use ($sherdog) {
            $sherdog->executeOnEachRefereeFromEvent($event, function($eachReferee) {
                $referee = Referee::where('name', $eachReferee['name'])->first();
                if($referee == null)
                {
                    $referee = new Referee();
                }
    
                $referee->name = $eachReferee['name'];
                $referee->save();
            });
        });
        $this->newLine();
        $this->comment(Referee::count() . " referees on database");
    }

    public function createDivisions(Sherdog $sherdog)
    {
        // $divisions = $sherdog->getDivisions();
        // $divisionsCount = count($divisions);
        // $this->info("Found $divisionsCount divisions");
        // foreach ($divisions as $eachDivision)
        // {
        //     $division = Division::where('name', $eachDivision['name'])->first();
        //     if($division == null)
        //     {
        //         $division = new Division();
        //     }
        //     $division->name = $eachDivision['name'];
        //     $division->weight = $eachDivision['weight'];
        //     $division->save();
        // }

        $this->info("Getting divisions");
        $this->withProgressBar(Event::all(), function ($event, $bar) use ($sherdog) {
            $sherdog->executeOnEachDivisionsFromEvent($event, function($eachDivision) {
                $division = Division::where('name', $eachDivision['name'])->first();
                if($division == null)
                {
                    $division = new Division();
                }
                $division->name = $eachDivision['name'];
                $division->weight = $eachDivision['weight'];
                $division->save();

            });
        });
        $this->newLine();
        $this->comment(Division::count() . " divisions on database");
    }

    public function createFighters(Sherdog $sherdog)
    {
        // $fighters = $sherdog->getFighters();
        // $fightersCount = count($fighters);
        // $this->info("Found $fightersCount fighters");
        // foreach ($fighters as $eachFighter)
        // {
        //     $fighter = Fighter::where('name', $eachFighter['name'])->first();
        //     if($fighter == null)
        //     {
        //         $fighter = new Fighter();
        //     }
        //     $fighter->name = $eachFighter['name'];
        //     $fighter->link = $eachFighter['link'];
        //     $fighter->nickname = $eachFighter['nickname'];
        //     $fighter->country = $eachFighter['country'];
        //     $fighter->city = $eachFighter['city'];
        //     $fighter->birthday = $eachFighter['birthday'];
        //     $fighter->died = $eachFighter['died'];
        //     $fighter->height = $eachFighter['height'];
        //     $fighter->weight = $eachFighter['weight'];
        //     $fighter->save();
        // }

        $this->info("Getting fighters");
        $this->withProgressBar(Event::all(), function ($event) use ($sherdog) {
            $sherdog->executeOnEachFightersFromEvent($event, function($eachFighter) {
                $fighter = Fighter::where('name', $eachFighter['name'])->first();
                if($fighter == null)
                {
                    $fighter = new Fighter();
                }
                $fighter->name = $eachFighter['name'];
                $fighter->link = $eachFighter['link'];
                $fighter->nickname = $eachFighter['nickname'];
                $fighter->country = $eachFighter['country'];
                $fighter->city = $eachFighter['city'];
                $fighter->birthday = $eachFighter['birthday'];
                $fighter->died = $eachFighter['died'];
                $fighter->height = $eachFighter['height'];
                $fighter->weight = $eachFighter['weight'];
                $fighter->save();
            });
        });
        $this->newLine();
        $this->comment(Fighter::count() . " fighters on database");
    }

    public function createFights(Sherdog $sherdog)
    {
        // $fights = $sherdog->getFights();
        // $fightsCount = count($fights);
        // $this->info("Found $fightsCount fights");
        // foreach ($fights as $eachFight)
        // {
        //     $event = Event::where('name', $eachFight['event'])->first();
        //     $fighter1 = Fighter::where('name', $eachFight['fighter1'])->first();
        //     $fighter2 = Fighter::where('name', $eachFight['fighter2'])->first();
        //     $referee = Referee::where('name', $eachFight['referee'])->first();
        //     $division = Division::where('name', $eachFight['division'])->first();

        //     $fight = Fight::where('event_id', $event->id)
        //         ->where('fighter1_id', $fighter1->id)
        //         ->where('fighter2_id', $fighter2->id)
        //         ->first();
        //     if($fight == null)
        //     {
        //         $fight = new Fight();
        //     }

        //     $fight->position = $eachFight['position'];
        //     $fight->event_id = $event->id;
        //     $fight->fighter1_id = $fighter1->id;
        //     $fight->fighter1_result = $eachFight['fighter1_result'];
        //     $fight->fighter2_id = $fighter2->id;
        //     $fight->fighter2_result = $eachFight['fighter2_result'];
        //     if($division != null)
        //     {
        //         $fight->division_id = $division->id;
        //     }
        //     $fight->method = $eachFight['method'];
        //     $fight->referee_id = $referee->id;
        //     $fight->round = $eachFight['round'];
        //     $fight->time = $eachFight['time'];
        //     $fight->save();
        // }

        $this->info("Getting fights");
        $this->withProgressBar(Event::all(), function ($event) use ($sherdog) {
            $sherdog->executeOnEachFightsFromEvent($event, function($eachFight) {
                $event = Event::where('name', $eachFight['event'])->first();
                $fighter1 = Fighter::where('name', $eachFight['fighter1'])->first();
                $fighter2 = Fighter::where('name', $eachFight['fighter2'])->first();
                $referee = Referee::where('name', $eachFight['referee'])->first();
                $division = Division::where('name', $eachFight['division'])->first();
    
                $fight = Fight::where('event_id', $event->id)
                    ->where('fighter1_id', $fighter1->id)
                    ->where('fighter2_id', $fighter2->id)
                    ->first();
                if($fight == null)
                {
                    $fight = new Fight();
                }
    
                $fight->position = $eachFight['position'];
                $fight->event_id = $event->id;
                $fight->fighter1_id = $fighter1->id;
                $fight->fighter1_result = $eachFight['fighter1_result'];
                $fight->fighter2_id = $fighter2->id;
                $fight->fighter2_result = $eachFight['fighter2_result'];
                if($division != null)
                {
                    $fight->division_id = $division->id;
                }
                $fight->method = $eachFight['method'];
                $fight->referee_id = $referee->id;
                $fight->round = $eachFight['round'];
                $fight->time = $eachFight['time'];
                $fight->save();
            });
        });
        $this->newLine();
        $this->comment(Fight::count() . " fights on database");
    }

    public function handle(Sherdog $sherdog)
    {
        $this->createEvents($sherdog);
        $this->createReferees($sherdog);
        $this->createDivisions($sherdog);
        $this->createFighters($sherdog);
        $this->createFights($sherdog);
    }
}
