<?php

namespace App\Console\Commands;

use App\Models\City;
use App\Models\Country;
use App\Models\Division;
use App\Models\Event;
use App\Models\Fight;
use App\Models\Fighter;
use App\Models\Record;
use App\Models\Referee;
use App\Models\Streak;
use App\Services\Cache;
use App\Services\Sherdog;
use Illuminate\Console\Command;

class RefreshEvents extends Command
{
    protected $signature = 'sherdog:refresh {--force=false}';

    protected $description = 'Refresh the events from Sherdog';

    public function handle(Sherdog $sherdog, Cache $cache)
    {
        $force = $this->option('force');

        $this->createCities($sherdog, $cache, $force === 'true');
        $this->createEvents($sherdog, $cache);
        $this->createReferees($sherdog);
        $this->createDivisions($sherdog);
        // // TODO: add fighter photo
        $this->createFighters($sherdog);
        // // TODO: get fights from outside ufc (from fighter history)
        $this->createFights($sherdog);
        $this->createStats($sherdog);
        $this->createRecords($sherdog);
    }

    private function createRecords(Sherdog $sherdog)
    {
        $this->info('Getting recods');
        Record::truncate();

        $this->withProgressBar(Fighter::all(), function ($fighter) {
            $fights = Fight::where('fighter_id', $fighter['id'])->where('state', 'finished')->get();

            $wins = 0;
            $losses = 0;
            $draws = 0;
            $ncs = 0;
            $octagonSeconds = 0;
            foreach ($fights as $fight) {
                $parts = explode(':', $fight->time);
                $octagonSeconds += (int) $parts[0] * 60 + (int) $parts[1];

                if ($fight->fighter1_id === $fighter->id) {
                    if ($fight->fighter1_result === 'win') {
                        $wins += 1;
                    } elseif ($fight->fighter1_result === 'loss') {
                        $losses += 1;
                    } elseif ($fight->fighter1_result === 'draw') {
                        $draws += 1;
                    } elseif ($fight->fighter1_result === 'nc') {
                        $ncs += 1;
                    }
                } elseif ($fight->fighter2_id === $fighter->id) {
                    if ($fight->fighter2_result === 'win') {
                        $wins += 1;
                    } elseif ($fight->fighter2_result === 'loss') {
                        $losses += 1;
                    } elseif ($fight->fighter2_result === 'draw') {
                        $draws += 1;
                    } elseif ($fight->fighter2_result === 'nc') {
                        $ncs += 1;
                    }
                }
            }

            Record::create(['name' => 'fights', 'value' => count($fights), 'fighter_id' => $fighter['id']]);
            Record::create(['name' => 'wins', 'value' => $wins, 'fighter_id' => $fighter['id']]);
            Record::create(['name' => 'losses', 'value' => $losses, 'fighter_id' => $fighter['id']]);
            Record::create(['name' => 'ncs', 'value' => $ncs, 'fighter_id' => $fighter['id']]);
            Record::create(['name' => 'draws', 'value' => $draws, 'fighter_id' => $fighter['id']]);
            Record::create(['name' => 'octagon time', 'value' => $octagonSeconds, 'fighter_id' => $fighter['id']]);
        });

        $this->newLine();
        $this->comment(Record::count().' records on database');
    }

    private function createStats(Sherdog $sherdog)
    {
        $this->info('Getting stats');
        Streak::truncate();

        $this->withProgressBar(Fighter::all(), function ($fighter) use ($sherdog) {
            $fights = Fight::where('state', 'finished')
                ->where(function ($query) {
                    $query->where('fighter1_id', $fighter['id'])
                        ->orWhere('fighter2_id', $fighter['id']);
                })
                ->join('events', 'fights.event_id', '=', 'events.id')
                ->orderBy('events.date', 'desc')
                ->get();

            $streaks = $sherdog->getFightStatsFromFighter($fights, $fighter);
            foreach ($streaks as $currentStreak) {
                $streak = new Streak;
                $streak->result = $currentStreak['type'];
                $streak->counter = $currentStreak['counter'];
                $streak->from = $currentStreak['from'];
                $streak->to = $currentStreak['to'];
                $streak->fighter_id = $fighter->id;
                $streak->save();
            }
        });
        $this->newLine();
        $this->comment(Streak::count().' streaks on database');
    }

    private function createCities(Sherdog $sherdog, Cache $cache, $force)
    {
        $this->info('Getting countries');
        $sherdog->executeOnEachCity($force, function ($eachCountry) {
            $country = Country::where('name', $eachCountry['country'])->first();
            if ($country === null) {
                $country = new Country;
            }

            $country->name = $eachCountry['country'];
            $country->save();

            $city = City::where('name', $eachCountry['city'])->where('country_id', $country->id)->first();
            if ($city === null) {
                $city = new City;
            }
            $city->name = $eachCountry['city'];
            $city->country_id = $country->id;
            $city->save();
        });
        $this->withProgressBar(Country::all(), function ($country) {});
        $this->newLine();
        $this->comment(Country::count().' countries on database');
        $this->comment(City::count().' cities on database');
    }

    private function createEvents(Sherdog $sherdog, Cache $cache)
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

        $this->info('Getting events');
        $sherdog->executeOnEachEvent(function ($eachEvent) use ($cache) {
            $country = Country::where('name', $eachEvent['country'])->first();
            $city = City::where('name', $eachEvent['city'])->where('country_id', $country->id)->first();

            $event = Event::where('name', $eachEvent['name'])->first();
            if ($event === null) {
                $event = new Event;
            } else {
                if ($event->state !== $eachEvent['state']) {
                    Fight::where('event_id', $event->id)->delete();
                    $cache->remove($event['link']);
                }
            }

            $event->name = $eachEvent['name'];
            $event->fight = $eachEvent['fight'];
            $event->location = $eachEvent['location'];
            $event->city_id = $city->id;
            $event->date = $eachEvent['date'];
            $event->link = $eachEvent['link'];
            $event->state = $eachEvent['state'];
            $event->save();
        });
        $this->withProgressBar(Event::all(), function ($event) {});
        $this->newLine();
        $this->comment(Event::count().' events on database');
    }

    private function createReferees(Sherdog $sherdog)
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

        $this->info('Getting referees');
        $this->withProgressBar(Event::all(), function ($event) use ($sherdog) {
            $sherdog->executeOnEachRefereeFromEvent($event, function ($eachReferee) {
                $referee = Referee::where('name', $eachReferee['name'])->first();
                if ($referee === null) {
                    $referee = new Referee;
                }

                $referee->name = $eachReferee['name'];
                $referee->save();
            });
        });
        $this->newLine();
        $this->comment(Referee::count().' referees on database');
    }

    private function createDivisions(Sherdog $sherdog)
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

        $this->info('Getting divisions');
        $this->withProgressBar(Event::all(), function ($event, $bar) use ($sherdog) {
            $sherdog->executeOnEachDivisionsFromEvent($event, function ($eachDivision) {
                $division = Division::where('name', $eachDivision['name'])->first();
                if ($division === null) {
                    $division = new Division;
                }
                $division->name = $eachDivision['name'];
                $division->weight = $eachDivision['weight'];
                $division->save();

            });
        });
        $this->newLine();
        $this->comment(Division::count().' divisions on database');
    }

    private function createFighters(Sherdog $sherdog)
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

        $this->info('Getting fighters');
        $this->withProgressBar(Event::all(), function ($event) use ($sherdog) {
            $sherdog->executeOnEachFightersFromEvent($event, function ($eachFighter) {
                $country = Country::where('name', $eachFighter['country'])->first();
                if ($country === null) {
                    $country = new Country;
                }

                $country->name = $eachFighter['country'];
                $country->save();

                $city = City::where('name', $eachFighter['city'])->where('country_id', $country->id)->first();
                if ($city === null) {
                    $city = new City;
                }
                $city->name = $eachFighter['city'];
                $city->country_id = $country->id;
                $city->save();

                $fighter = Fighter::where('name', $eachFighter['name'])->first();
                if ($fighter === null) {
                    $fighter = new Fighter;
                }
                $fighter->name = $eachFighter['name'];
                $fighter->link = $eachFighter['link'];
                $fighter->nickname = $eachFighter['nickname'];
                $fighter->city_id = $city->id;
                $fighter->birthday = $eachFighter['birthday'];
                $fighter->died = $eachFighter['died'];
                $fighter->height = $eachFighter['height'];
                $fighter->weight = $eachFighter['weight'];
                $fighter->save();
            });
        });
        $this->newLine();
        $this->comment(Fighter::count().' fighters on database');
    }

    private function createFights(Sherdog $sherdog)
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

        $this->info('Getting fights');
        $this->withProgressBar(Event::all(), function ($event) use ($sherdog) {
            $sherdog->executeOnEachFightsFromEvent($event, function ($eachFight) {
                $event = Event::where('name', $eachFight['event'])->first();
                $fighter1 = Fighter::where('name', $eachFight['fighter1'])->first();
                $fighter2 = Fighter::where('name', $eachFight['fighter2'])->first();
                $referee = Referee::where('name', $eachFight['referee'])->first();
                $division = Division::where('name', $eachFight['division'])->first();

                $fight = Fight::where('event_id', $event->id)
                    ->where('fighter1_id', $fighter1->id)
                    ->where('fighter2_id', $fighter2->id)
                    ->first();
                if ($fight === null) {
                    $fight = new Fight;
                }

                $fight->position = $eachFight['position'];
                $fight->event_id = $event->id;
                $fight->fighter1_id = $fighter1->id;
                $fight->fighter1_result = $eachFight['fighter1_result'];
                $fight->fighter2_id = $fighter2->id;
                $fight->fighter2_result = $eachFight['fighter2_result'];
                if ($division !== null) {
                    $fight->division_id = $division->id;
                }
                $fight->method = $eachFight['method'];
                $fight->method_detail = $eachFight['method_detail'];
                if ($referee !== null) {
                    $fight->referee_id = $referee->id;
                }
                $fight->round = $eachFight['round'];
                $fight->time = $eachFight['time'];
                $fight->state = $eachFight['state'];
                $fight->save();
            });
        });
        $this->newLine();
        $this->comment(Fight::count().' fights on database');
        $this->comment(Country::count().' countries on database');
        $this->comment(City::count().' cities on database');
    }
}
