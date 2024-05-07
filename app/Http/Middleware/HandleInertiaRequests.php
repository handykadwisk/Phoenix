<?php

namespace App\Http\Middleware;

use App\Models\Menu;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        if (Auth::check()) {
            return [
                ...parent::share($request),
                'auth' => [
                    'user'       => $request->user(),
                    'role'       => $request->user()->role,
                    'menu'       => $request->user()->role->menu,
                ],
                'custom_menu' => Menu::where(['menu_is_deleted' => 0, 'menu_parent_id' => null])->get(),
                'flash' => [
                    'message' => fn () => $request->session()->get('message')
                ],
                'ziggy' => fn () => [
                    ...(new Ziggy)->toArray(),
                    'location' => $request->url(),
                ],
            ];
        } else {
            return [
                ...parent::share($request),
                'auth' => [
                    'user' => $request->user(),
                ],
                'ziggy' => fn () => [
                    ...(new Ziggy)->toArray(),
                    'location' => $request->url(),
                ],
            ];
        }
    }
}
