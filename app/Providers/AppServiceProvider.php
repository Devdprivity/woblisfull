<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Solo ejecutar en producción
        if (app()->environment('production')) {
            $this->ensureDirectoriesExist();
        }
    }

    /**
     * Ensure all required storage directories exist
     */
    private function ensureDirectoriesExist(): void
    {
        try {
            $directories = [
                storage_path('framework/views'),
                storage_path('framework/cache'),
                storage_path('framework/sessions'),
                storage_path('logs'),
                storage_path('app/public'),
            ];

            foreach ($directories as $directory) {
                if (!File::exists($directory)) {
                    File::makeDirectory($directory, 0755, true);
                }
            }
        } catch (\Exception $e) {
            // Log error pero no interrumpir el booteo
            \Log::warning("Error creating directories: " . $e->getMessage());
        }
    }
}
