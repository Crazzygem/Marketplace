<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class FlexibleAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if basic auth is enabled via environment variable
        if (config('app.use_basic_auth', false)) {
            // Handle basic authentication
            $headers = $request->header('Authorization');

            if (! $headers) {
                return response()->json(['message' => 'Authorization header required'], 401);
            }

            if (strpos($headers, 'Basic ') !== 0) {
                return response()->json(['message' => 'Basic authentication required'], 401);
            }

            $credentials = base64_decode(substr($headers, 6)); // Remove 'Basic ' prefix
            $parts = explode(':', $credentials, 2);

            if (count($parts) !== 2) {
                return response()->json(['message' => 'Invalid credentials format'], 401);
            }

            [$email, $password] = $parts;

            $user = User::where('email', $email)->first();

            if (! $user || ! password_verify($password, $user->password)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // Authenticate the user
            Auth::login($user);
        } else {
            // Use default sanctum authentication
            if (! $request->user()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
        }

        return $next($request);
    }
}
