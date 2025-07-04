<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
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
        $faker = \Faker\Factory::create('es_ES');
        $posts = Post::all();
        $comments = Comment::all();

        if ($posts->isEmpty()) {
            $this->command->error('No hay posts disponibles. Ejecuta PostSeeder primero.');
            return;
        }

        if ($comments->isEmpty()) {
            $this->command->error('No hay comentarios disponibles. Ejecuta CommentSeeder primero.');
            return;
        }

        $totalLikesCreated = 0;

        // Crear likes para posts
        foreach ($posts as $post) {
            $numberOfLikes = rand(10, 30); // Entre 10 y 30 likes por post

            for ($i = 0; $i < $numberOfLikes; $i++) {
                $ip = $faker->ipv4;
                $userAgent = $faker->userAgent;
                $sessionId = $faker->uuid;

                // Verificar que no exista ya un like con esta combinación
                if (!Like::where([
                    'likeable_type' => Post::class,
                    'likeable_id' => $post->id,
                    'ip_address' => $ip,
                    'session_id' => $sessionId,
                ])->exists()) {
                    Like::create([
                        'likeable_type' => Post::class,
                        'likeable_id' => $post->id,
                        'ip_address' => $ip,
                        'user_agent' => $userAgent,
                        'session_id' => $sessionId,
                        'created_at' => now()->subDays(rand(1, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59)),
                    ]);
                    $totalLikesCreated++;
                }
            }
        }

        // Crear likes para comentarios
        foreach ($comments as $comment) {
            $numberOfLikes = rand(0, 5); // Entre 0 y 5 likes por comentario

            for ($i = 0; $i < $numberOfLikes; $i++) {
                $ip = $faker->ipv4;
                $userAgent = $faker->userAgent;
                $sessionId = $faker->uuid;

                // Verificar que no exista ya un like con esta combinación
                if (!Like::where([
                    'likeable_type' => Comment::class,
                    'likeable_id' => $comment->id,
                    'ip_address' => $ip,
                    'session_id' => $sessionId,
                ])->exists()) {
                    Like::create([
                        'likeable_type' => Comment::class,
                        'likeable_id' => $comment->id,
                        'ip_address' => $ip,
                        'user_agent' => $userAgent,
                        'session_id' => $sessionId,
                        'created_at' => now()->subDays(rand(1, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59)),
                    ]);
                    $totalLikesCreated++;
                }
            }
        }

        $this->command->info("✅ Se crearon {$totalLikesCreated} likes en total.");
        $this->command->info("📊 Desglose de likes:");

        $postLikes = Like::where('likeable_type', Post::class)->count();
        $commentLikes = Like::where('likeable_type', Comment::class)->count();

        $this->command->info("   • Posts: {$postLikes} likes");
        $this->command->info("   • Comentarios: {$commentLikes} likes");
    }
}
