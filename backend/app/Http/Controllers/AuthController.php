<?php

namespace App\Http\Controllers;

use App\Http\Requests\TokenAuthRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    function login(TokenAuthRequest $request) {
        $user = User::where('email', $request->email)->first();
     
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
                'password' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('UNKNOWN DEVICE');
        $token->accessToken->forceFill([
            'platform_id' => $request->platform_id,
            'platform' => $request->platform,
            'model' => $request->model,
            'version' => $request->version,
        ])->save();

        return $token->plainTextToken;
    }
    
    function logout(Request $request) {
        return $request->user()->currentAccessToken()->delete();
    }
}
