<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class OptimizeForProduction extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:optimize-production';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimize application for production deployment';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Starting production optimization...');

        // Ensure storage directories exist
        $this->ensureStorageDirectories();

        // Clear all caches
        $this->info('🧹 Clearing caches...');
        $this->call('cache:clear');
        $this->call('config:clear');
        $this->call('route:clear');
        $this->call('view:clear');

        // Optimize for production
        $this->info('⚡ Optimizing for production...');
        $this->call('config:cache');
        $this->call('route:cache');
        $this->call('view:cache');

        $this->info('✅ Production optimization completed successfully!');

        return Command::SUCCESS;
    }

    /**
     * Ensure all required storage directories exist
     */
    private function ensureStorageDirectories()
    {
        $directories = [
            storage_path('framework/cache'),
            storage_path('framework/sessions'),
            storage_path('framework/views'),
            storage_path('logs'),
            storage_path('app/public'),
        ];

        foreach ($directories as $directory) {
            if (!File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
                $this->info("Created directory: {$directory}");
            }
        }
    }
}
