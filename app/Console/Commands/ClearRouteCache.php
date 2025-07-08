<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ClearRouteCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'route:clear-cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear the route cache and regenerate it';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Clearing route cache...');

        // Clear route cache
        $this->call('route:clear');

        // Clear config cache
        $this->call('config:clear');

        // Clear application cache
        $this->call('cache:clear');

        // Regenerate route cache
        $this->call('route:cache');

        $this->info('Route cache cleared and regenerated successfully!');

        return 0;
    }
}
