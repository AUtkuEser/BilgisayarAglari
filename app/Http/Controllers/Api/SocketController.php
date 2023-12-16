<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponses;
use App\Models\ChatRoomMessage;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use function Laravel\Prompts\password;

class SocketController extends Controller
{
    public function auth(Request $request)
    {
        $user = User::query()->where('email', $request->email)->first();

        if (!$user) {
            return ApiResponses::error(message: 'User not found');
        }

        if (password_verify($request->password, $user->password)) {
            return ApiResponses::success($user, 'User authenticated successfully', 200);
        }

        if (!Hash::check($request->password, $user->password)) {
            return ApiResponses::error(message: 'Invalid credentials');
        }

        return ApiResponses::error(message: 'Something went wrong');
    }

    public function logout(): JsonResponse
    {
        $user = auth()->user();
        $user->token = null;

        return response()->json('Logged out successfully', 200);
    }

    public function register(Request $request): JsonResponse
    {
        $validation = Validator::make($request->all(), [
            'username' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required'
        ]);

        if (User::query()->where('username', $request->username)->exists()) {
            return ApiResponses::error(message: 'Username already exists');
        }

        if (User::query()->where('email', $request->email)->exists()) {
            return ApiResponses::error(message: 'Email already exists');
        }

        $user = User::create([
            'username' => $request->input('username'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password'))
        ]);

        if (!$user) {
            return ApiResponses::error(message: 'User not created');
        }

        return ApiResponses::success($user, 'User created successfully', 200);
    }



}
