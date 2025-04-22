<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TokenAuthRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'password' => 'required',
            'platform_id' => 'required',
            'platform' => 'required',
            'model' => 'required',
            'version' => 'required',
        ];
    }
}
