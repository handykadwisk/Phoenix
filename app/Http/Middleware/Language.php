<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Route;

class Language
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Prosesnya:
        // 1. Middleware membaca current url/ route
        // 2. Middleware akan mengambil file JSON bahasa di resources->language sesuai current route/url
        // 3. PASTIKAN NAMA FILE JSON HARUS SAMA SEPERTI URL
        // 4. Untuk URL yang ada slashnya "/", proses di bawah akan mereplace "/" menjadi "-"
        // 5. Sehingga jika url settings/menu, pastikan nama file JSON menjadi settings-menu.json
        // 6. Kemudian akan memeriksa bahasa pada table m_user_additional yang telah direlasikan dengan table user (cek model User)
        // 7. Jika user yang login belum pernah login/ pertama kali, dan belum punya data di m_user_additional, maka akan otomatis akan meng-insert
        // user_id, dan "en" untuk languagenya (cek file AuthenticatedSessionController.php)
        // 8. Setelah mendapatkan informasi dan file JSONnya, inject data ke Inertia (language) untuk diterima di front-end
        // 9. Pengimplentasian tiap route, cek file web.php
        // 10. Tiap menambahkan halaman/ menu baru, tambahkan juga file JSON di resources->language->en->(nama routenya) dan juga
        // resources->language->id->(nama routenya)
        // 11. Terakhir tambahkan " ->middleware(Language:class) " hanya di method yang merender page pertama kali, biasanya class index.
        $currentRoute = '';

        if (str_contains($request->path(), '/')) {
            $currentRoute = str_replace('/', '-', $request->path());
        } else {
            $currentRoute = $request->path();
        }

        $languageCode = Auth::user()->additional->user_language;

        // Specify the path to the language JSON files
        $languagePath = base_path('resources/language');
        $languageFilePath = "{$languagePath}/{$languageCode}/{$currentRoute}.json";

        $data = json_decode(file_get_contents($languageFilePath), true);

        // Inject data into Inertia
        inertia()->share('language', [$data]);

        return $next($request);
        // dd($currentRoute);
    }
}
