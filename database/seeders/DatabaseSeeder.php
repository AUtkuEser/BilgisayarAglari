<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\ChatRoom;
use App\Models\ChatRoomUser;
use App\Models\ChatRoomMessage;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'username' => 'Admin',
            'email' => 'admin@admin.com',
        ]);

        User::factory(10)->create();
        ChatRoom::factory(2)->create();

        ChatRoom::query()->create([
            'name' => 'Group Chat',
        ]);

        ChatRoomUser::query()->create([
            'chat_room_id' => 1,
            'user_id' => 1,
        ]);

        ChatRoomUser::query()->create([
            'chat_room_id' => 1,
            'user_id' => 2,
        ]);

        ChatRoomUser::query()->create([
            'chat_room_id' => 1,
            'user_id' => 3,
        ]);

        ChatRoomUser::query()->create([
            'chat_room_id' => 2,
            'user_id' => 1,
        ]);

        ChatRoomUser::query()->create([
            'chat_room_id' => 2,
            'user_id' => 2,
        ]);

//        ChatRoomMessage::query()->create([
//            'chat_room_id' => 1,
//            'user_id' => 1,
//            'message' => 'Hello World',
//        ]);
//
//        ChatRoomMessage::query()->create([
//            'chat_room_id' => 1,
//            'user_id' => 2,
//            'message' => 'alooooo',
//        ]);
    }
}
