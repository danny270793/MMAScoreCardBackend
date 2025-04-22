<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\UpdateDeviceRequest;

class UserController extends Controller
{
    function deleteDevice(Request $request, $id)
    {
        $user = $request->user();
        $user->tokens()->where('id', $id)->delete();
    }

    function updateDevice(UpdateDeviceRequest $request, $id)
    {
        $user = $request->user();
        $token = $user->tokens()->where('id', $id)->firstOrFail();
        $token->name = $request->name;
        $token->save();

        return response()->json($token);
    }

    function getDevice(Request $request, $id)
    {
        $user = $request->user();
        $currentAccessToken = $request->user()->currentAccessToken();
        $token = $user->tokens()->where('id', $id)->get()[0];
        $token->current = $currentAccessToken->id === $token->id;
        return response()->json($token);
    }

    function listDevices(Request $request)
    {
        $user = $request->user();
        $currentAccessToken = $request->user()->currentAccessToken();
        $currentAccessToken->current = true;
        $otherTokens = $user->tokens()->where('id', '<>', $currentAccessToken->id)->get();
        return response()->json([$currentAccessToken, ...$otherTokens]);
    }
}
