<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LoggerController extends Controller
{
    /**
     * Store client-side error logs
     * This endpoint is public (no auth required) so frontend can log errors without a token
     */
    public function clientErrors(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'context' => 'nullable|string',
            'stack' => 'nullable|string',
            'timestamp' => 'nullable|string',
            'url' => 'nullable|string',
            'userAgent' => 'nullable|string',
        ]);

        // Log to Laravel's log file
        Log::error('Client Error: ' . $validated['message'], [
            'context' => $validated['context'] ?? 'unknown',
            'stack' => $validated['stack'] ?? null,
            'timestamp' => $validated['timestamp'] ?? now()->toISOString(),
            'url' => $validated['url'] ?? 'unknown',
            'user_agent' => $validated['userAgent'] ?? 'unknown',
        ]);

        return response()->json(['success' => true]);
    }
}
