<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('X-Admin-Token');
        
        if ($token !== 'rengoku2026') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        return $next($request);
    }
}