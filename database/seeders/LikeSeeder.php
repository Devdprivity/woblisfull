<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\Like;

class LikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = Post::all();

        if ($posts->isEmpty()) {
            $this->command->error('No hay posts disponibles. Ejecuta PostSeeder primero.');
            return;
        }

        $ips = [
            '192.168.1.1', '10.0.0.1', '172.16.0.1', '203.0.113.1', '198.51.100.1',
            '192.0.2.1', '203.0.113.50', '198.51.100.50', '192.168.1.50', '10.0.0.50',
            '172.16.0.50', '203.0.113.100', '198.51.100.100', '192.168.1.100', '10.0.0.100',
            '203.0.113.150', '198.51.100.150', '192.168.1.150', '10.0.0.150', '172.16.0.150',
        ];

        $emails = [
            'user1@example.com', 'user2@example.com', 'user3@example.com', 'user4@example.com',
            'user5@example.com', 'user6@example.com', 'user7@example.com', 'user8@example.com',
            'user9@example.com', 'user10@example.com', 'maria@gmail.com', 'carlos@outlook.com',
            'ana@yahoo.com', 'roberto@gmail.com', 'gabriela@hotmail.com', 'pedro@gmail.com',
            'lucia@outlook.com', 'diego@yahoo.com', 'sofia@gmail.com', 'andres@hotmail.com',
        ];

        $names = [
            'María García', 'Carlos López', 'Ana Martínez', 'Roberto Silva', 'Gabriela Torres',
            'Pedro Rodríguez', 'Lucía Fernández', 'Diego Morales', 'Sofía Herrera', 'Andrés Castillo',
            'Carmen Jiménez', 'Miguel Ruiz', 'Isabel Vargas', 'Francisco Ortega', 'Pilar Ramos',
        ];

        $totalLikesCreated = 0;

        // Crear likes para posts
        foreach ($posts as $post) {
            $numberOfLikes = rand(10, 80); // Entre 10 y 80 likes por post

            for ($i = 0; $i < $numberOfLikes; $i++) {
                $email = $emails[array_rand($emails)];
                $name = $names[array_rand($names)];
                $ip = $ips[array_rand($ips)];

                // Verificar que no exista ya un like de este email para este post
                if (!Like::where('post_id', $post->id)->where('user_email', $email)->exists()) {
                    Like::create([
                        'post_id' => $post->id,
                        'user_email' => $email,
                        'user_name' => $name,
                        'ip_address' => $ip,
                        'created_at' => now()->subDays(rand(1, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59)),
                    ]);
                    $totalLikesCreated++;
                }
            }

            // Actualizar el contador de likes del post
            $actualLikes = Like::where('post_id', $post->id)->count();
            $post->update(['likes_count' => $actualLikes]);
        }

        $this->command->info("✅ Se crearon {$totalLikesCreated} likes para posts.");
        $this->command->info("📊 Likes por post:");
        foreach ($posts as $post) {
            $likesCount = Like::where('post_id', $post->id)->count();
            $this->command->info("   • {$post->title}: {$likesCount} likes");
        }
    }
}
