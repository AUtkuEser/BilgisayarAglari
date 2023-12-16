<?php

use App\Models\ChatRoom;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chat_room_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ChatRoom::class, 'chat_room_id')->constrained()->cascadeOnDelete();
            $table->foreignIdFor(User::class, 'user_id')->constrained()->cascadeOnDelete();
            $table->string('message')->nullable()->default(null);
            $table->string('image')->nullable()->default(null);
            $table->string('video')->nullable()->default(null);
            $table->string('audio')->nullable()->default(null);
            $table->string('document')->nullable()->default(null);
            $table->string('sticker')->nullable()->default(null);
            $table->string('gif')->nullable()->default(null);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_room_messages');
    }
};
