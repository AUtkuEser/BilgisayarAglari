<?php

namespace App\Http\Controllers\Api;

use App\Events\Message;
use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponses;
use App\Models\ChatRoomMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatRoomMessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'chat_room_id' => 'required',
            'user_id' => 'required',
            'message' => 'required',
        ]);

        if (!$data) {
            return ApiResponses::error(message: 'Invalid data');
        }

        $message = ChatRoomMessage::query()->create([
            'chat_room_id' => $data['chat_room_id'],
            'user_id' => $data['user_id'],
            'message' => $data['message'],
        ]);

        return ApiResponses::success($message, 'Message sent successfully', 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(ChatRoomMessage $chatRoomMessage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ChatRoomMessage $chatRoomMessage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ChatRoomMessage $chatRoomMessage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ChatRoomMessage $chatRoomMessage)
    {
        //
    }
}
