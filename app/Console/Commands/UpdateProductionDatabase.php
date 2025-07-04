<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UpdateProductionDatabase extends Command
{
    protected $signature = 'db:update-production';
    protected $description = 'Update production database with latest migrations and seeders';

    public function handle()
    {
        $this->info('🚀 Updating production database...');

        // Check current state
        $this->info('📋 Checking current database state...');

        try {
            // Check if campaigns table exists and has correct structure
            if (Schema::hasTable('campaigns')) {
                $columns = Schema::getColumnListing('campaigns');
                $this->info('Campaigns table columns: ' . implode(', ', $columns));

                if (!in_array('title', $columns)) {
                    $this->warn('⚠️  Campaigns table needs to be updated (missing title column)');
                } else {
                    $this->info('✅ Campaigns table structure is correct');
                }
            } else {
                $this->error('❌ Campaigns table does not exist');
                return 1;
            }

            // Run migrations
            $this->info('🗃️ Running migrations...');
            $this->call('migrate', ['--force' => true]);

            // Check if we have campaigns data
            $campaignCount = DB::table('campaigns')->count();
            $this->info("📊 Found {$campaignCount} campaigns in database");

            if ($campaignCount === 0) {
                $this->info('🌱 No campaigns found, running seeders...');
                $this->call('db:seed', ['--force' => true]);
            }

            // Final verification
            $this->info('🔍 Final verification...');
            $finalCount = DB::table('campaigns')->count();
            $this->info("✅ Database updated successfully! {$finalCount} campaigns available");

            return 0;

        } catch (\Exception $e) {
            $this->error('❌ Error updating database: ' . $e->getMessage());
            return 1;
        }
    }
}
