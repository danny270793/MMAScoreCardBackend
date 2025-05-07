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
            'platform' => 'required',
            'model' => 'required',
            'os_model' => 'required',
            'version' => 'required',
            'os_version' => 'required',
            'manufacturer' => 'required',
        ];
    }
}
