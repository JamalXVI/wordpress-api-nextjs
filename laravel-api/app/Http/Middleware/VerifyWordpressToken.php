<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyWordpressToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (!$request->hasHeader('X-WordPress-Token')) {
            return response()->json(['message' => 'Missing WordPress token'], 401);
        }
        return $next($request);
    }
}
