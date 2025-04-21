<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventsTest extends TestCase
{
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/api/events');
        $response->assertStatus(200);
    }

    public function test_the_app_return_10_events(): void
    {
        $response = $this->get('/api/events');
        $response->assertJsonCount(10, 'data');
    }

    public function test_the_events_paginator_works(): void
    {
        $response = $this->get('/api/events?page=2');
        $response->assertJsonFragment(['current_page' => 2]);
    }

    public function test_the_app_return_events_structure(): void
    {
        $response = $this->get('/api/events');
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'fight',
                    'location',
                    'city',
                    'date',
                ],
            ],
        ]);
    }
}
