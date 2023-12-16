<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\ChatRoom;
use App\Models\ChatRoomMember;
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
        User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'username' => 'TestUser',
            'email' => 'test@example.com',
        ]);

        ChatRoom::query()->create([
            'name' => 'Test Chat1',
        ]);

        ChatRoomMember::query()->create([
            'chat_room_id' => 1,
            'user_id' => 1,
        ]);

        ChatRoomMember::query()->create([
            'chat_room_id' => 1,
            'user_id' => 2,
        ]);

        ChatRoomMessage::query()->create([
            'chat_room_id' => 1,
            'user_id' => 1,
            'message' => 'Hello World',
        ]);

        ChatRoomMessage::query()->create([
            'chat_room_id' => 1,
            'user_id' => 2,
            'message' => 'alooooo',
        ]);
    }
}
