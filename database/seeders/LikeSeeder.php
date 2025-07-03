<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\Comment;
use App\Models\Like;

class LikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = Post::all();
        $comments = Comment::all();

        $ips = [
            '192.168.1.1', '10.0.0.1', '172.16.0.1', '203.0.113.1', '198.51.100.1',
            '192.0.2.1', '203.0.113.50', '198.51.100.50', '192.168.1.50', '10.0.0.50',
            '172.16.0.50', '203.0.113.100', '198.51.100.100', '192.168.1.100', '10.0.0.100',
            '203.0.113.150', '198.51.100.150', '192.168.1.150', '10.0.0.150', '172.16.0.150',
            '203.0.113.200', '198.51.100.200', '192.168.1.200', '10.0.0.200', '172.16.0.200',
            '203.0.113.250', '198.51.100.250', '192.168.1.250', '10.0.0.250', '172.16.0.250',
        ];

        $postLikesCreated = 0;
        $commentLikesCreated = 0;

        // Crear likes para posts
        foreach ($posts as $post) {
            $numberOfLikes = rand(10, 80); // Entre 10 y 80 likes por post

            for ($i = 0; $i < $numberOfLikes; $i++) {
                Like::create([
                    'likeable_type' => 'App\Models\Post',
                    'likeable_id' => $post->id,
                    'ip_address' => $ips[array_rand($ips)],
                    'created_at' => now()->subDays(rand(1, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59)),
                    'updated_at' => now()->subDays(rand(0, 5)),
                ]);
                $postLikesCreated++;
            }

            // Actualizar el contador de likes del post
            $post->update([
                'likes_count' => $post->likes()->count()
            ]);
        }

        // Crear likes para comentarios
        foreach ($comments as $comment) {
            $numberOfLikes = rand(0, 12); // Entre 0 y 12 likes por comentario

            for ($i = 0; $i < $numberOfLikes; $i++) {
                Like::create([
                    'likeable_type' => 'App\Models\Comment',
                    'likeable_id' => $comment->id,
                    'ip_address' => $ips[array_rand($ips)],
                    'created_at' => $comment->created_at->addMinutes(rand(5, 1440)), // Likes después de que se creó el comentario
                    'updated_at' => now()->subDays(rand(0, 2)),
                ]);
                $commentLikesCreated++;
            }

            // Actualizar el contador de likes del comentario
            $comment->update([
                'likes_count' => $comment->likes()->count()
            ]);
        }

        $this->command->info("Se crearon {$postLikesCreated} likes para posts y {$commentLikesCreated} likes para comentarios.");
        $this->command->info("Total de likes creados: " . ($postLikesCreated + $commentLikesCreated));
    }
}
