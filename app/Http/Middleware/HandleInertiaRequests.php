<?php

namespace App\Http\Middleware;

use App\Models\Menu;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
        $user = $request->user();
        $menu = Menu::where('menu_is_deleted', 0)->get()->toArray();
        // Log::info($menu);

        if (Auth::check()) {
            // Cek apakah type_user_id adalah 1
            $menu = [];
            if ($user->type_user_id === 1) {
                // Ambil semua menu jika type_user_id adalah 1 (administrator atau sejenisnya)
                Log::info('Admin user detected');
                $menu = Menu::where('menu_is_deleted', 0)->get()->toArray();
            } else {
                // Jika bukan type_user_id 1, ambil berdasarkan role user
                $menu = $user->roles->pluck('menu')->flatten()->unique('id')->values()->toArray();
            }
        

            return [
                ...parent::share($request),
                'auth' => [
                    'user'       => $request->user(),
                    'role'       => $request->user()->roles->pluck('id'),
                    'menu'       => $menu,  // Menu yang sudah di-filter
                    'permission' => $user->roles->pluck('permission')->flatten(),
                    'additional' => $request->user()->additional
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
