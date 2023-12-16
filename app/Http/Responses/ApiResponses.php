<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

class ApiResponses
{
    public static function success(mixed $data = null, string $message = null, int $code = 200, array $headers = []) : JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message,
        ], $code, $headers);
    }

    public static function error(mixed $data = null, string $message = null, int $code = 400, array $headers = []): JsonResponse
    {
        return response()->json([
            'success' => false,
            'data' => $data,
            'message' => $message,
        ], $code, $headers);
    }
}
