<?php

use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\ChatRoomMessageController;
use App\Http\Controllers\Api\SocketController;
use App\Http\Middleware\AuthWithBearerToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/auth', [SocketController::class, 'auth']);
Route::post('/register', [SocketController::class, 'register']);

Route::post('messages', [ChatController::class, 'message']);

Route::middleware(AuthWithBearerToken::class)->group(function () {
    Route::resource('chats', ChatController::class);
    Route::get('chats2/{id}', [ChatController::class, 'getChatRoomMessages']);
    Route::resource('message', ChatRoomMessageController::class);
    Route::get('/search/{username}', [ChatController::class, 'search']);
    Route::resource('addChat', ChatController::class);
});
