<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FighterSearchRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'query' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'query.required' => 'A query is required',
            'query.string' => 'The query must be an string',
        ];
    }
}
