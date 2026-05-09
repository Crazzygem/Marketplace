<?php

namespace Tests\Unit\Middleware;

use App\Http\Middleware\AdminMiddleware;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class AdminMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_middleware_allows_admin(): void
    {
        $admin = User::factory()->admin()->create();

        $request = Request::create('/api/admin/dashboard', 'GET');
        $request->setUserResolver(fn () => $admin);

        $middleware = new AdminMiddleware();

        $response = $middleware->handle($request, fn () => response('next'));

        $this->assertEquals('next', $response->getContent());
    }

    public function test_admin_middleware_blocks_non_admin(): void
    {
        $user = User::factory()->create();

        $request = Request::create('/api/admin/dashboard', 'GET');
        $request->setUserResolver(fn () => $user);

        $middleware = new AdminMiddleware();

        $response = $middleware->handle($request, fn () => response('next'));

        $this->assertEquals(403, $response->getStatusCode());
        $this->assertEquals(['message' => 'Unauthorized: Admin access required'], $response->getData(true));
    }
}
