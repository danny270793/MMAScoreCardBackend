<?php

namespace App\Services;

use App\Models\Division;
use App\Models\Event;
use App\Models\Fight;
use App\Models\Referee;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Sherdog
{
    private $cache;

    private $baseUrl = 'https://www.sherdog.com';

    public function __construct(Cache $cache)
    {
        $this->cache = $cache;
    }

    public function getFightStatsFromFighter($fights, $fighter)
    {
        $streaks = [];
        foreach ($fights as $fight) {
            if (count($streaks) === 0) {
                $streak = [
                    'counter' => 1,
                    'type' => $this->fightStatusForFighter($fight, $fighter),
                    'from' => $fight->event->date,
                    'to' => $fight->event->date,
                ];
                $streaks[] = $streak;
            } else {
                $type = $this->fightStatusForFighter($fight, $fighter);

                if ($streaks[count($streaks) - 1]['type'] === $type) {
                    $streaks[count($streaks) - 1]['counter'] += 1;
                } else {
                    $streaks[count($streaks) - 1]['from'] = $fight->event->date;

                    $streaks[] = [
                        'type' => $type,
                        'counter' => 1,
                        'from' => $fight->event->date,
                        'to' => $fight->event->date,
                    ];
                }
            }
        }

        return $streaks;
    }

    public function getHtml($url, $forceRefresh = false)
    {
        if ($forceRefresh) {
            $this->cache->remove($url);
        }

        $has = $this->cache->has($url);
        if ($has) {
            return $this->cache->get($url);
        }

        Log::info("GET $url");
        $response = Http::get($url);
        $responseStatus = $response->status();
        if ($responseStatus !== 200) {
            throw new \Exception("GET $url returns non 200 status => $responseStatus");
        }

        $html = $response->body();
        $this->cache->put($url, $html);

        return $html;
    }

    public function executeOnEachEventFromPage($page, $callback, $forceRefresh = false)
    {
        $eventsCounter = 0;

        $url = "$this->baseUrl/organizations/Ultimate-Fighting-Championship-UFC-2/recent-events/$page";
        $html = $this->getHtml($url, $forceRefresh);

        $dom = new \DOMDocument;
        libxml_use_internal_errors(true);
        $dom->loadHTML($html);
        $tables = $dom->getElementsByTagName('table');
        $tableNumber = -1;
        foreach ($tables as $table) {
            if (! $table->getAttribute('class') === 'new_table event') {
                continue;
            }

            $tableNumber += 1;
            if ($page > 1 && $tableNumber === 0) {
                continue;
            }

            $rows = $table->getElementsByTagName('tr');
            $rowNumber = -1;
            foreach ($rows as $row) {
                $rowNumber += 1;
                if ($rowNumber === 0) {
                    continue;
                }
                $columns = $row->getElementsByTagName('td');
                $dateText = trim($columns->item(0)->textContent);
                $date = Carbon::createFromFormat('M j Y', $dateText);

                $link = $columns->item(1)->getElementsByTagName('a')->item(0)->getAttribute('href');

                $fightTitle = trim($columns->item(1)->textContent);
                if (strpos($fightTitle, 'vs') !== false) {
                    $phrases = explode('-', $fightTitle);
                    $eventName = trim($phrases[0]);
                    $mainFight = trim($phrases[1]);
                } else {
                    $eventName = $fightTitle;
                    $mainFight = null;
                }

                $location = trim($columns->item(2)->textContent);
                $words = explode(',', $location);
                $country = trim(end($words));

                $parts = explode(',', $location);
                $city = trim($parts[1]);
                if($city == null) {
                    $city = 'NO CITY';
                }

                $location = trim($words[0]);

                $event = [
                    'name' => $eventName,
                    'fight' => $mainFight,
                    'location' => $location,
                    'country' => $country,
                    'city' => $city,
                    'date' => $date,
                    'link' => "$this->baseUrl$link",
                    'state' => $tableNumber === 0 ? 'upcoming' : 'finished',
                ];
                $callback($event);
                $eventsCounter += 1;
            }
        }

        return $eventsCounter;
    }

    // public function getEventsFromPage($page)
    // {
    //     $events = [];

    //     $url = "$this->baseUrl/organizations/Ultimate-Fighting-Championship-UFC-2/recent-events/$page";
    //     $html = $this->getHtml($url);

    //     $dom = new \DOMDocument();
    //     libxml_use_internal_errors(true);
    //     $dom->loadHTML($html);
    //     $tables = $dom->getElementsByTagName('table');
    //     $tableNumber = -1;
    //     foreach ($tables as $table)
    //     {
    //         if(!$table->getAttribute('class') == "new_table event")
    //         {
    //             continue;
    //         }

    //         $tableNumber += 1;
    //         if($page > 0 && $tableNumber == 0)
    //         {
    //             continue;
    //         }

    //         $rows = $table->getElementsByTagName('tr');
    //         $rowNumber = -1;
    //         foreach ($rows as $row)
    //         {
    //             $rowNumber += 1;
    //             if($rowNumber == 0)
    //             {
    //                 continue;
    //             }
    //             $columns = $row->getElementsByTagName('td');
    //             $dateText = trim($columns->item(0)->textContent);
    //             $date = Carbon::createFromFormat('M j Y', $dateText);

    //             $link = $columns->item(1)->getElementsByTagName('a')->item(0)->getAttribute('href');

    //             $fightTitle = trim($columns->item(1)->textContent);
    //             if(strpos($fightTitle, "vs") !== false)
    //             {
    //                 $phrases = explode("-", $fightTitle);
    //                 $eventName = trim($phrases[0]);
    //                 $mainFight = trim($phrases[1]);
    //             }
    //             else
    //             {
    //                 $eventName = $fightTitle;
    //                 $mainFight = null;
    //             }

    //             $location = trim($columns->item(2)->textContent);
    //             $words = explode(",", $location);
    //             $country = trim(end($words));
    //             array_pop($words);
    //             $location = trim(implode(",", $words));

    //             $event = [
    //                 'name' => $eventName,
    //                 'fight' => $mainFight,
    //                 'location' => $location,
    //                 'country' => $country,
    //                 'date' => $date,
    //                 'link' => "$this->baseUrl$link"
    //             ];

    //             $events[] = $event;
    //         }
    //     }

    //     return $events;
    // }

    // public function getEvents()
    // {
    //     $events = [];

    //     $pageHasEvents = true;
    //     $page = 1;
    //     while($pageHasEvents)
    //     {
    //         $pageEvents = $this->getEventsFromPage($page);
    //         $events = array_merge($events, $pageEvents);
    //         if(count($pageEvents) == 0)
    //         {
    //             $pageHasEvents = false;
    //         }

    //         $page += 1;
    //     }

    //     return $events;
    // }

    public function executeOnEachCity($forceRefresh, $callback)
    {
        $pageHasEvents = true;
        $page = 1;
        while ($pageHasEvents) {
            $refreshPage = $forceRefresh && $page === 1;
            $pageEvents = $this->executeOnEachEventFromPage($page, function($eachEvent) use ($callback) {
                $country = [
                    'country' => $eachEvent['country'],
                    'city' => $eachEvent['city'],
                ];
                $callback($country);
            }, $refreshPage);
            if ($pageEvents === 0) {
                $pageHasEvents = false;
            }
            $page += 1;
        }
    }

    public function executeOnEachEvent($callback)
    {
        $pageHasEvents = true;
        $page = 1;
        while ($pageHasEvents) {
            $pageEvents = $this->executeOnEachEventFromPage($page, $callback);
            if ($pageEvents === 0) {
                $pageHasEvents = false;
            }
            $page += 1;
        }
    }

    public function getFighterDetails($dom, $column)
    {
        $fighterResult = null;

        $links = $column->getElementsByTagName('a');
        foreach ($links as $link) {
            $brs = $link->getElementsByTagName('br');
            foreach ($brs as $br) {
                $newline = $dom->createTextNode(' ');
                $br->parentNode->replaceChild($newline, $br);
            }

            $spans = $column->getElementsByTagName('span');
            foreach ($spans as $span) {
                if (strpos($span->getAttribute('class'), 'final_result') !== false) {
                    $fighterResult = trim($span->textContent);
                }
            }

            return [
                'fighterName' => $link->textContent,
                'fighterLink' => $this->baseUrl.$link->getAttribute('href'),
                'fighterResult' => $fighterResult === null ? 'yet to come' : strtolower($fighterResult),
            ];
        }

        throw new \Exception('No fighter name and link found in column');
    }

    public function executeOnEachFightsDataFromEvent($event, $callback)
    {
        Log::info('event='.$event['link']);

        $html = $this->getHtml($event['link']);
        $dom = new \DOMDocument;
        libxml_use_internal_errors(true);
        $dom->loadHTML($html);

        // check if event has fights
        $hasFights = false;
        $tables = $dom->getElementsByTagName('table');
        $tableNumber = -1;
        foreach ($tables as $table) {
            $tableClass = $table->getAttribute('class');
            if ($tableClass === 'new_table result' || $tableClass === 'new_table upcoming') {
                $hasFights = true;
            }
        }

        if (! $hasFights) {
            return;
        }

        // if has fights get them
        $divs = $dom->getElementsByTagName('div');
        foreach ($divs as $div) {
            if ($div->getAttribute('class') === 'fighter left_side') {
                $h3s = $div->getElementsByTagName('h3');
                foreach ($h3s as $h3) {
                    $fighter1Name = trim($h3->textContent);
                }

                $as = $div->getElementsByTagName('a');
                foreach ($as as $a) {
                    $fighter1Link = $this->baseUrl.$a->getAttribute('href');
                }

                $spans = $div->getElementsByTagName('span');
                foreach ($spans as $span) {
                    if (strpos($span->getAttribute('class'), 'final_result') !== false) {
                        $fighter1Result = strtolower(trim($span->textContent));
                    }
                }
            } elseif ($div->getAttribute('class') === 'fighter right_side') {
                $h3s = $div->getElementsByTagName('h3');
                foreach ($h3s as $h3) {
                    $fighter2Name = trim($h3->textContent);
                }

                $as = $div->getElementsByTagName('a');
                foreach ($as as $a) {
                    $fighter2Link = $this->baseUrl.$a->getAttribute('href');
                }

                $spans = $div->getElementsByTagName('span');
                foreach ($spans as $span) {
                    if (strpos($span->getAttribute('class'), 'final_result') !== false) {
                        $fighter2Result = strtolower(trim($span->textContent));
                    }
                }
            }
        }

        $divs = $dom->getElementsByTagName('div');
        foreach ($divs as $div) {
            if ($div->getAttribute('class') === 'fight_card') {
                $spans = $div->getElementsByTagName('span');
                foreach ($spans as $span) {
                    if ($span->getAttribute('class') === 'weight_class') {
                        $divisionName = trim($span->textContent);
                    }
                }
            }
        }

        $position = 100;
        $method = null;
        $refereeName = null;
        $round = null;
        $time = null;
        $state = 'upcoming';

        $tables = $dom->getElementsByTagName('table');
        foreach ($tables as $table) {
            if ($table->getAttribute('class') === 'fight_card_resume') {
                $rows = $table->getElementsByTagName('tr');
                foreach ($rows as $row) {
                    $columns = $row->getElementsByTagName('td');

                    $position = trim($columns->item(0)->textContent);
                    $position = trim(str_replace('Match', '', $position));

                    $method = trim(str_replace('Method', '', $columns->item(1)->textContent));
                    $refereeName = trim(str_replace('Referee', '', $columns->item(2)->textContent));
                    $round = trim(str_replace('Round', '', $columns->item(3)->textContent));
                    $time = trim(str_replace('Time', '', $columns->item(4)->textContent));
                    $state = 'finished';
                }
            }
        }

        $divisionName = trim(str_replace("\n", '', $divisionName));
        if (strpos($divisionName, 'TITLE FIGHT') !== false) {
            $divisionName = str_replace('TITLE FIGHT', '', $divisionName);
        } elseif (strpos($divisionName, 'lb') !== false) {
            $parts = explode('lb', $divisionName);
            $divisionName = end($parts);
        }
        $divisionName = trim($divisionName);

        $parts = explode('(', $method);
        $method = trim($parts[0]);
        $rest = array_slice($parts, 1);
        $methodDetail = rtrim(trim(implode('(', $rest)), ')');

        $fight = [
            'position' => $position,
            'fighter1Name' => $fighter1Name,
            'fighter1Link' => $fighter1Link,
            'fighter1Result' => $fighter1Result,
            'division' => $divisionName,
            'fighter2Name' => $fighter2Name,
            'fighter2Link' => $fighter2Link,
            'fighter2Result' => $fighter2Result,
            'method' => $method,
            'methodDetail' => $methodDetail,
            'referee' => $refereeName,
            'round' => $round,
            'time' => $time,
            'state' => $state,
        ];
        $callback($fight);

        $tables = $dom->getElementsByTagName('table');
        $tableNumber = -1;
        foreach ($tables as $table) {
            if (! $table->getAttribute('class') === 'new_table result') {
                continue;
            }

            $rows = $table->getElementsByTagName('tr');
            $rowsCount = count($rows);
            $rowNumber = -1;
            foreach ($rows as $row) {
                $rowNumber += 1;
                if ($rowNumber === 0) {
                    continue;
                }
                $columns = $row->getElementsByTagName('td');
                if ($columns->length === 5) {
                    $position = trim($columns->item(0)->textContent);

                    $fighter1Details = $this->getFighterDetails($dom, $columns->item(1));
                    $fighter1Name = $fighter1Details['fighterName'];
                    $fighter1Link = $fighter1Details['fighterLink'];
                    $fighter1Result = $fighter1Details['fighterResult'];

                    $divisionName = trim(str_replace("\n", '', $columns->item(2)->textContent));

                    $fighter2Details = $this->getFighterDetails($dom, $columns->item(3));
                    $fighter2Name = $fighter2Details['fighterName'];
                    $fighter2Link = $fighter2Details['fighterLink'];
                    $fighter2Result = $fighter2Details['fighterResult'];

                    $method = null;
                    $refereeName = null;
                    $round = null;
                    $time = null;
                    $state = 'upcoming';
                } elseif ($columns->length === 7) {
                    $position = trim($columns->item(0)->textContent);

                    $fighter1Details = $this->getFighterDetails($dom, $columns->item(1));
                    $fighter1Name = $fighter1Details['fighterName'];
                    $fighter1Link = $fighter1Details['fighterLink'];
                    $fighter1Result = $fighter1Details['fighterResult'];

                    $divisionName = trim($columns->item(2)->textContent);

                    $fighter2Details = $this->getFighterDetails($dom, $columns->item(3));
                    $fighter2Name = $fighter2Details['fighterName'];
                    $fighter2Link = $fighter2Details['fighterLink'];
                    $fighter2Result = $fighter2Details['fighterResult'];

                    $methodReferee = trim($columns->item(4)->textContent);
                    $methodReferee = explode("\n", $methodReferee);
                    $method = trim($methodReferee[0]);
                    $refereeName = trim($methodReferee[1]);

                    $round = trim($columns->item(5)->textContent);
                    $time = trim($columns->item(6)->textContent);
                    $state = 'finished';
                } else {
                    throw new \Exception('Unexpected number of columns: '.$columns->length);
                }

                if (strpos($divisionName, 'TITLE FIGHT') !== false) {
                    $divisionName = str_replace('TITLE FIGHT', '', $divisionName);
                } elseif (strpos($divisionName, 'lb') !== false) {
                    $parts = explode('lb', $divisionName);
                    $divisionName = end($parts);
                }
                $divisionName = trim($divisionName);

                $parts = explode('(', $method);
                $method = trim($parts[0]);
                $rest = array_slice($parts, 1);
                $methodDetail = rtrim(trim(implode('(', $rest)), ')');


                $fight = [
                    'position' => $position,
                    'fighter1Name' => $fighter1Name,
                    'fighter1Link' => $fighter1Link,
                    'fighter1Result' => $fighter1Result,
                    'division' => $divisionName,
                    'fighter2Name' => $fighter2Name,
                    'fighter2Link' => $fighter2Link,
                    'fighter2Result' => $fighter2Result,
                    'method' => $method,
                    'methodDetail' => $methodDetail,
                    'referee' => $refereeName,
                    'round' => $round,
                    'time' => $time,
                    'state' => $state,
                ];
                $callback($fight);
            }
        }
    }

    // public function getFightsDataFromEvent($event)
    // {
    //     $fights = [];

    //     $html = $this->getHtml($event['link']);
    //     $dom = new \DOMDocument();
    //     libxml_use_internal_errors(true);
    //     $dom->loadHTML($html);

    //     $divs = $dom->getElementsByTagName('div');
    //     foreach ($divs as $div)
    //     {
    //         if($div->getAttribute('class') == "left_side")
    //         {
    //             print($div->getAttribute('class') . "\n");
    //             $h3s = $row->getElementsByTagName('h3');
    //             foreach ($h3s as $h3)
    //             {
    //                 $fighter1Name = trim($h3->textContent);
    //             }

    //             $as = $row->getElementsByTagName('a');
    //             foreach ($as as $a)
    //             {
    //                 $fighter1Link = $a->getAttribute('href');
    //             }

    //             $spans = $row->getElementsByTagName('span');
    //             foreach ($spans as $span)
    //             {
    //                 if(strpos($span->getAttribute('class'), "final_result") !== false)
    //                 {
    //                     $fighter1Result = trim($span->textContent);
    //                 }
    //             }

    //             // $fight = [
    //             //     // 'position' => $position,
    //             //     'fighter1Name' => $fighter1Name,
    //             //     'fighter1Link' => $fighter1Link,
    //             //     'fighter1Result' => $fighter1Result,
    //             //     // 'division' => $divisionName,
    //             //     // 'fighter2Name' => $fighter2Name,
    //             //     // 'fighter2Link' => $fighter2Link,
    //             //     // 'fighter2Result' => $fighter2Result,
    //             //     // 'method' => $method,
    //             //     // 'referee' => $refereeName,
    //             //     // 'round' => $round,
    //             //     // 'time' => $time
    //             // ];
    //             // dd($fight);
    //             // $fights[] = $fight;
    //         }
    //     }

    //     $tables = $dom->getElementsByTagName('table');
    //     $tableNumber = -1;
    //     foreach ($tables as $table)
    //     {
    //         if(!$table->getAttribute('class') == "new_table result")
    //         {
    //             continue;
    //         }

    //         $rows = $table->getElementsByTagName('tr');
    //         $rowsCount = count($rows);
    //         $rowNumber = -1;
    //         foreach ($rows as $row)
    //         {
    //             $rowNumber += 1;
    //             if($rowNumber == 0)
    //             {
    //                 continue;
    //             }
    //             $columns = $row->getElementsByTagName('td');
    //             if($columns->length == 5)
    //             {
    //                 $position = trim($columns->item(0)->textContent);

    //                 $fighter1Details = $this->getFighterDetails($dom, $columns->item(1));
    //                 $fighter1Name = $fighter1Details['fighterName'];
    //                 $fighter1Link = $fighter1Details['fighterLink'];
    //                 $fighter1Result = $fighter1Details['fighterResult'];

    //                 $divisionName = trim(str_replace("\n", '', $columns->item(2)->textContent));

    //                 $fighter2Details = $this->getFighterDetails($dom, $columns->item(3));
    //                 $fighter2Name = $fighter2Details['fighterName'];
    //                 $fighter2Link = $fighter2Details['fighterLink'];
    //                 $fighter2Result = $fighter2Details['fighterResult'];

    //                 $method = null;
    //                 $refereeName = null;
    //                 $round = null;
    //                 $time = null;
    //             }
    //             else if($columns->length == 7)
    //             {
    //                 $position = trim($columns->item(0)->textContent);

    //                 $fighter1Details = $this->getFighterDetails($dom, $columns->item(1));
    //                 $fighter1Name = $fighter1Details['fighterName'];
    //                 $fighter1Link = $fighter1Details['fighterLink'];
    //                 $fighter1Result = $fighter1Details['fighterResult'];

    //                 $divisionName = trim($columns->item(2)->textContent);

    //                 $fighter2Details = $this->getFighterDetails($dom, $columns->item(3));
    //                 $fighter2Name = $fighter2Details['fighterName'];
    //                 $fighter2Link = $fighter2Details['fighterLink'];
    //                 $fighter2Result = $fighter2Details['fighterResult'];

    //                 $methodReferee = trim($columns->item(4)->textContent);
    //                 $methodReferee = explode("\n", $methodReferee);
    //                 $method = trim($methodReferee[0]);
    //                 $refereeName = trim($methodReferee[1]);

    //                 $round = trim($columns->item(5)->textContent);
    //                 $time = trim($columns->item(6)->textContent);
    //             }
    //             else
    //             {
    //                 throw new \Exception("Unexpected number of columns: " . $columns->length);
    //             }

    //             if(strpos($divisionName, 'TITLE FIGHT') !== false)
    //             {
    //                 $divisionName = str_replace('TITLE FIGHT', '', $divisionName);
    //             }
    //             else if(strpos($divisionName, 'lb') !== false)
    //             {
    //                 $parts = explode("lb", $divisionName);
    //                 $divisionName = end($parts);
    //             }
    //             $divisionName = trim($divisionName);

    //             $fight = [
    //                 'position' => $position,
    //                 'fighter1Name' => $fighter1Name,
    //                 'fighter1Link' => $fighter1Link,
    //                 'fighter1Result' => $fighter1Result,
    //                 'division' => $divisionName,
    //                 'fighter2Name' => $fighter2Name,
    //                 'fighter2Link' => $fighter2Link,
    //                 'fighter2Result' => $fighter2Result,
    //                 'method' => $method,
    //                 'referee' => $refereeName,
    //                 'round' => $round,
    //                 'time' => $time
    //             ];
    //             $fights[] = $fight;
    //         }
    //     }

    //     return $fights;
    // }

    // public function filterNonRepeatedBy($field, $array)
    // {
    //     $nonRepeateds = [];

    //     $itemCounter = -1;
    //     foreach($array as $item)
    //     {
    //         $itemCounter += 1;
    //         if(count($nonRepeateds) == 0)
    //         {
    //             $nonRepeateds[] = $item;
    //             continue;
    //         }
    //         else
    //         {
    //             $alreadyExists = false;
    //             foreach($nonRepeateds as $nonRepeated)
    //             {
    //                 if($item[$field] == $nonRepeated[$field])
    //                 {
    //                     $alreadyExists = true;
    //                     break;
    //                 }
    //             }
    //             if(!$alreadyExists)
    //             {
    //                 $nonRepeateds[] = $item;
    //             }
    //         }
    //     }

    //     return $nonRepeateds;
    // }

    public function executeOnEachRefereeFromEvent($event, $callback)
    {
        $this->executeOnEachFightsDataFromEvent($event, function ($fight) use ($callback) {
            if ($fight['referee'] === null) {
                return;
            }

            $referee = [
                'name' => $fight['referee'],
            ];
            $callback($referee);
        });
    }

    // public function getRefereesFromEvent($event)
    // {
    //     $referees = [];

    //     $rows = $this->getFightsDataFromEvent($event);
    //     foreach($rows as $row)
    //     {
    //         $referee = [
    //             'name' => $row['referee'],
    //         ];

    //         $referees[] = $referee;
    //     }

    //     return $referees;
    // }

    // public function getReferees()
    // {
    //     $referees = [];

    //     $events = $this->getEvents();
    //     foreach ($events as $event)
    //     {
    //         $eventReferees = $this->getRefereesFromEvent($event);
    //         $referees = array_merge($referees, $eventReferees);
    //     }

    //     return $this->filterNonRepeatedBy('name', $referees);
    // }

    public function executeOnEachReferee($callback)
    {
        $this->executeOnEachEvent(function ($event) use ($callback) {
            $this->executeOnEachRefereeFromEvent($event, $callback);
        });
    }

    public function executeOnEachDivisionsFromEvent($event, $callback)
    {
        $this->executeOnEachFightsDataFromEvent($event, function ($data) use ($callback) {
            if ($data['division'] === '') {
                return;
            }

            switch (strtoupper($data['division'])) {
                case 'FLYWEIGHT': $divisionWeight = 125;
                    break;
                case 'BANTAMWEIGHT': $divisionWeight = 135;
                    break;
                case 'FEATHERWEIGHT': $divisionWeight = 145;
                    break;
                case 'LIGHTWEIGHT': $divisionWeight = 155;
                    break;
                case 'WELTERWEIGHT': $divisionWeight = 170;
                    break;
                case 'MIDDLEWEIGHT': $divisionWeight = 185;
                    break;
                case 'LIGHT HEAVYWEIGHT': $divisionWeight = 205;
                    break;
                case 'HEAVYWEIGHT': $divisionWeight = 225;
                    break;
                default: $divisionWeight = null;
                    break;
            }

            $division = [
                'name' => $data['division'],
                'weight' => $divisionWeight,
            ];

            $callback($division);
        });
    }

    // public function getDivisionsFromEvent($event)
    // {
    //     $divisions = [];

    //     $events = $this->getFightsDataFromEvent($event);
    //     foreach($events as $event)
    //     {
    //         if($event['division'] == '')
    //         {
    //             continue;
    //         }

    //         switch(strtoupper($event['division']))
    //         {
    //             case 'FLYWEIGHT': $divisionWeight = 125; break;
    //             case 'BANTAMWEIGHT': $divisionWeight = 135; break;
    //             case 'FEATHERWEIGHT': $divisionWeight = 145; break;
    //             case 'LIGHTWEIGHT': $divisionWeight = 155; break;
    //             case 'WELTERWEIGHT': $divisionWeight = 170; break;
    //             case 'MIDDLEWEIGHT': $divisionWeight = 185; break;
    //             case 'LIGHT HEAVYWEIGHT': $divisionWeight = 205; break;
    //             case 'HEAVYWEIGHT': $divisionWeight = 225; break;
    //             default: $divisionWeight = null; break;
    //         }

    //         $division = [
    //             "name" => $event['division'],
    //             "weight" => $divisionWeight
    //         ];

    //         $divisions[] = $division;
    //     }

    //     return $divisions;
    // }

    // public function getDivisions()
    // {
    //     $divisions = [];

    //     $events = $this->getEvents();
    //     $eventsCount = count($events);
    //     $eventsCounter = -1;
    //     foreach ($events as $event)
    //     {
    //         $eventsCounter += 1;
    //         $eventDivisions = $this->getDivisionsFromEvent($event);
    //         $divisions = array_merge($divisions, $eventDivisions);
    //     }

    //     return $this->filterNonRepeatedBy('name', $divisions);
    // }

    public function executeOnEachDivision($callback)
    {
        $this->executeOnEachEvent(function ($event) use ($callback) {
            $this->executeOnEachDivisionsFromEvent($event, $callback);
        });
    }

    public function getFightersDetails($fighter)
    {
        $html = $this->getHtml($fighter['link']);

        $dom = new \DOMDocument;
        libxml_use_internal_errors(true);
        $dom->loadHTML($html);
        $spans = $dom->getElementsByTagName('span');
        foreach ($spans as $span) {
            $className = $span->getAttribute('class');
            if ($className === 'item birthplace') {
                $strongs = $span->getElementsByTagName('strong');
                foreach ($strongs as $strong) {
                    $nationality = trim($strong->textContent);
                }

                $spans = $span->getElementsByTagName('span');
                foreach ($spans as $span) {
                    $city = trim($span->textContent);
                }
            }

            if ($className === 'nickname') {
                $nickname = trim($span->textContent);
                $nickname = substr($nickname, 1, -1);
            }
        }

        $divs = $dom->getElementsByTagName('div');
        foreach ($divs as $div) {
            if ($div->getAttribute('class') === 'fighter-data') {
                $tables = $div->getElementsByTagName('table');
                foreach ($tables as $table) {
                    $rows = $table->getElementsByTagName('tr');
                    $rowNumber = -1;
                    foreach ($rows as $row) {
                        $rowNumber += 1;
                        $columns = $row->getElementsByTagName('td');
                        $rowName = trim($columns->item(0)->textContent);
                        if ($rowName === 'AGE') {
                            $birthday = $columns->item(1)->textContent;
                            $birthday = trim(explode('/', $birthday)[1]);
                            if ($birthday === 'N/A') {
                                $birthday = null;
                            } else {
                                $birthday = Carbon::parse($birthday);
                            }
                        }
                        if ($rowName === 'DIED') {
                            $died = $columns->item(1)->textContent;
                            $died = Carbon::parse($died);
                        }
                        if ($rowName === 'HEIGHT') {
                            $height = $columns->item(1)->textContent;
                            $height = trim(explode('/', $height)[1]);
                            $height = trim(explode(' ', $height)[0]);
                        }
                        if ($rowName === 'WEIGHT') {
                            $weight = $columns->item(1)->textContent;
                            $weight = trim(explode('/', $weight)[0]);
                            $weight = trim(explode(' ', $weight)[0]);
                        }
                    }
                }
            }
        }

        return [
            'nickname' => $nickname ?? null,
            'country' => $nationality ?? 'NO COUNTRY',
            'city' => $city ?? 'NO CITY',
            'birthday' => $birthday,
            'died' => $died ?? null,
            'height' => $height,
            'weight' => $weight,
        ];
    }

    public function executeOnEachFightersFromEvent($event, $callback)
    {
        $this->executeOnEachFightsDataFromEvent($event, function ($fight) use ($callback) {
            $fighter1 = [
                'name' => $fight['fighter1Name'],
                'link' => $fight['fighter1Link'],
            ];
            $fighter1Details = $this->getFightersDetails($fighter1);

            $fighter1['nickname'] = $fighter1Details['nickname'];
            $fighter1['country'] = $fighter1Details['country'];
            $fighter1['city'] = $fighter1Details['city'];
            $fighter1['birthday'] = $fighter1Details['birthday'];
            $fighter1['died'] = $fighter1Details['died'];
            $fighter1['height'] = $fighter1Details['height'];
            $fighter1['weight'] = $fighter1Details['weight'];

            $callback($fighter1);

            $fighter2 = [
                'name' => $fight['fighter2Name'],
                'link' => $fight['fighter2Link'],
            ];
            $fighter2Details = $this->getFightersDetails($fighter2);

            $fighter2['nickname'] = $fighter2Details['nickname'];
            $fighter2['country'] = $fighter2Details['country'];
            $fighter2['city'] = $fighter2Details['city'];
            $fighter2['birthday'] = $fighter2Details['birthday'];
            $fighter2['died'] = $fighter2Details['died'];
            $fighter2['height'] = $fighter2Details['height'];
            $fighter2['weight'] = $fighter2Details['weight'];

            $callback($fighter2);
        });
    }

    // public function getFightersFromEvent($event)
    // {
    //     $fighters = [];

    //     $events = $this->getFightsDataFromEvent($event);
    //     foreach($events as $event)
    //     {
    //         $fighter1 = [
    //             'name' => $event['fighter1Name'],
    //             'link' => $event['fighter1Link']
    //         ];
    //         $fighter1Details = $this->getFightersDetails($fighter1);

    //         $fighter1['nickname'] = $fighter1Details['nickname'];
    //         $fighter1['country'] = $fighter1Details['country'];
    //         $fighter1['city'] = $fighter1Details['city'];
    //         $fighter1['birthday'] = $fighter1Details['birthday'];
    //         $fighter1['died'] = $fighter1Details['died'];
    //         $fighter1['height'] = $fighter1Details['height'];
    //         $fighter1['weight'] = $fighter1Details['weight'];

    //         $fighters[] = $fighter1;

    //         $fighter2 = [
    //             'name' => $event['fighter2Name'],
    //             'link' => $event['fighter2Link']
    //         ];
    //         $fighter2Details = $this->getFightersDetails($fighter2);

    //         $fighter2['nickname'] = $fighter2Details['nickname'];
    //         $fighter2['country'] = $fighter2Details['country'];
    //         $fighter2['city'] = $fighter2Details['city'];
    //         $fighter2['birthday'] = $fighter2Details['birthday'];
    //         $fighter2['died'] = $fighter2Details['died'];
    //         $fighter2['height'] = $fighter2Details['height'];
    //         $fighter2['weight'] = $fighter2Details['weight'];

    //         $fighters[] = $fighter2;
    //     }

    //     return $fighters;
    // }

    public function executeOnEachFighter($callback)
    {
        $this->executeOnEachEvent(function ($event) use ($callback) {
            $this->executeOnEachFightersFromEvent($event, $callback);
        });
    }

    // public function getFighters()
    // {
    //     $fighters = [];

    //     $events = $this->getEvents();
    //     $eventsCount = count($events);
    //     $eventsCounter = -1;
    //     foreach ($events as $event)
    //     {
    //         $eventsCounter += 1;
    //         $eventFighters = $this->getFightersFromEvent($event);
    //         $fighters = array_merge($fighters, $eventFighters);
    //     }

    //     return $this->filterNonRepeatedBy('name', $fighters);
    // }

    public function executeOnEachFightsFromEvent($event, $callback)
    {
        $this->executeOnEachFightsDataFromEvent($event, function ($fight) use ($event, $callback) {
            $fight = [
                'position' => $fight['position'],
                'event' => $event['name'],
                'fighter1' => $fight['fighter1Name'],
                'fighter1_result' => $fight['fighter1Result'],
                'fighter2' => $fight['fighter2Name'],
                'fighter2_result' => $fight['fighter2Result'],
                'division' => $fight['division'],
                'method' => $fight['method'],
                'method_detail' => $fight['methodDetail'],
                'referee' => $fight['referee'],
                'round' => $fight['round'],
                'time' => $fight['time'],
                'state' => $fight['state'],
            ];

            $callback($fight);
        });
    }

    // public function getFightsFromEvent($event)
    // {
    //     $fights = [];

    //     $rows = $this->getFightsDataFromEvent($event);
    //     foreach($rows as $row)
    //     {
    //         $fight = [
    //             'position' => $row['position'],
    //             'event' => $event['name'],
    //             'fighter1' => $row['fighter1Name'],
    //             'fighter1_result' => $row['fighter1Result'],
    //             'fighter2' => $row['fighter2Name'],
    //             'fighter2_result' => $row['fighter2Result'],
    //             'division' => $row['division'],
    //             'method' => $row['method'],
    //             'referee' => $row['referee'],
    //             'round' => $row['round'],
    //             'time' => $row['time'],
    //         ];
    //         $fights[] = $fight;
    //     }

    //     return $fights;
    // }

    // public function getFights()
    // {
    //     $fights = [];

    //     $events = $this->getEvents();
    //     foreach ($events as $event)
    //     {
    //         $eventFights = $this->getFightsFromEvent($event);
    //         $fights = array_merge($fights, $eventFights);
    //     }

    //     return $fights;
    // }

    public function executeOnEachFight($callback)
    {
        $this->executeOnEachEvent(function ($event) use ($callback) {
            $this->executeOnEachFightsFromEvent($event, $callback);
        });
    }

    private function fightStatusForFighter($fight, $fighter)
    {
        if ($fight->fighter1->id === $fighter->id) {
            return $fight->fighter1_result;
        } elseif ($fight->fighter2->id === $fighter->id) {
            return $fight->fighter2_result;
        }

        return null;
    }
}
