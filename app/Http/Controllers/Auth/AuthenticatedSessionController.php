<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\UserAdditional;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $attempt = $request->session()->regenerate();

        if ($attempt) {
            // check language user
            $isUserLanguageExist = UserAdditional::where('user_id', Auth::user()->id)->get();
            if (count($isUserLanguageExist) < 1) {
                UserAdditional::create([
                    'user_id'                       => Auth::user()->id,
                    'user_language'                 => 'en',
                    'user_additional_created_by'    => Auth::user()->id,
                    'user_additional_created_date'  => now()
                ]);
            }

            return redirect()->intended(route('dashboard', absolute: false));
        }

    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
