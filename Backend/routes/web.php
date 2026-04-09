<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

// Custom route to serve storage files with CORS headers
Route::get('/storage/{path}', function (string $path) {
    // Construct the full path to the file in the storage/app/public directory
    $fullPath = storage_path('app/public/'.$path);

    // Check if file exists
    if (! File::exists($fullPath)) {
        abort(404);
    }

    // Security check: ensure the resolved path is within the allowed storage directory
    $realPath = realpath($fullPath);
    $allowedDir = realpath(storage_path('app/public'));

    // Security check: ensure the resolved path is within the allowed storage directory
    if (! $realPath || ! $allowedDir) {
        abort(403);
    }

    // Normalize both paths and check if the file path starts with the allowed directory
    $normalizedRealPath = str_replace('\\', '/', $realPath);
    $normalizedAllowedDir = str_replace('\\', '/', $allowedDir);

    if (! str_starts_with($normalizedRealPath, $normalizedAllowedDir.'/')) {
        abort(403);
    }

    $response = new BinaryFileResponse($fullPath);
    $response->headers->set('Access-Control-Allow-Origin', '*');
    $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    return $response;
})->where('path', '.*');

Route::get('/', function () {
    return view('welcome');
});
