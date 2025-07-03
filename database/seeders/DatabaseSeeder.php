<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and plans first
        $this->call([
            RoleSeeder::class,
            PlanSeeder::class,
        ]);

        // Create admin user automatically
        $this->call([
            AdminSeeder::class,
        ]);

        // Create test user manually (Faker not available in production)
        $clientRole = Role::where('name', 'client')->first();
        if ($clientRole && !User::where('email', 'test@example.com')->exists()) {
            User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => Hash::make('password'),
                'account_type' => 'client',
                'role_id' => $clientRole->id,
                'status' => 'active',
                'email_verified_at' => now(),
                'provider' => 'email',
            ]);
        }

        // Seed companies and blog content
        $this->call([
            CompanySeeder::class,
            PostSeeder::class,
        ]);

        // Seed blog interactions (comments and likes)
        $this->call([
            CommentSeeder::class,  // Crear comentarios después de los posts
            LikeSeeder::class,     // Crear likes después de comentarios y posts
        ]);

        // Seeders de campañas
        $this->call([
            CampaignSeeder::class,
            QuestionSeeder::class,
            SurveyResponseSeeder::class,
            CampaignInteractionSeeder::class,
        ]);
    }
}
