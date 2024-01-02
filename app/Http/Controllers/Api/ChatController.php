<?php

namespace App\Http\Controllers\Api;

use App\Events\Message;
use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponses;
use App\Models\ChatRoom;
use App\Models\ChatRoomMessage;
use App\Models\User;
use Illuminate\Http\Request;
use function Sodium\add;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $chatRooms = $user->chat_rooms()->with('users')->get();

        if ($chatRooms->isEmpty()) {
            return ApiResponses::error(message: 'No chat rooms found');
        }

        $allMessages = $user->chat_rooms()->with('messages')->get();
        $lastMessage = $allMessages->map(function ($chatRoom) {
            return $chatRoom->messages->last();
        });

        if ($lastMessage->isEmpty()) {
            return ApiResponses::error(message: 'No messages found');
        }

        $data = [
            'chatRooms' => $chatRooms,
            'lastMessage' => $lastMessage,
        ];

        return ApiResponses::success(data:$data);

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
    public function store(Request $request)
    {
        //create chat room with users.
        $data = $request->validate([
            'name' => 'required',
            'users' => 'required',
        ]);

        if (!$data) {
            return ApiResponses::error(message: 'Invalid data');
        }

        $chatRoom = ChatRoom::query()->create([
            'name' => $data['name'],
        ]);

        $chatRoom->users()->attach($data['users']);

        return ApiResponses::success($chatRoom, 'Chat room created successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ChatRoom $chatRoom)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ChatRoom $chatRoom)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ChatRoom $chatRoom)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ChatRoom $chatRoom)
    {
        //
    }

    // Dosya Adı: SocketController.php
    public function message(Request $request)
    {
        $data = $request->validate([
            'chat_room_id' => 'required',
            'user_id' => 'required',
            'message' => 'required',
        ]);

        if (!$data) {
            return ApiResponses::error(message: 'Invalid data');
        }

        broadcast(new Message($data))->toOthers();
    }


    public function getChatRoomMessages(Request $request)
    {
        $chatRoomMessages = ChatRoomMessage::query()->where('chat_room_id', $request->id)->get();

        $authUser = auth()->user();
        $chatroom = ChatRoom::query()->where('id', $request->id)->first();
        $users = $chatroom->users()->get();

        $chatUsers = array();

        foreach ($users as $user) {
            if ($user->id !== $authUser->id) {
               $chatUsers[] = $user;
            }
        }

        $data = [
            'chatRoomMessages' => $chatRoomMessages,
            'target' => $chatUsers,
        ];


        return ApiResponses::success(data: $data);
    }

    public function search($username)
    {
        $users = User::query()->where('username', 'LIKE', "%{$username}%")->get();

        if ($users->isEmpty()) {
            return ApiResponses::error(message: 'No users found');
        }

        return ApiResponses::success(data: $users);
    }
}
