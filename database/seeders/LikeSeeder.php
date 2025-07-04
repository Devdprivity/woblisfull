<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Post;
use App\Models\Comment;
use App\Models\Like;
use Illuminate\Support\Str;

class LikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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

        // IPs de ejemplo
        $ips = [
            '192.168.1.1', '10.0.0.1', '172.16.0.1', '203.0.113.1', '198.51.100.1',
            '192.0.2.1', '203.0.113.50', '198.51.100.50', '192.168.1.50', '10.0.0.50',
            '172.16.0.50', '203.0.113.100', '198.51.100.100', '192.168.1.100', '10.0.0.100',
        ];

        // User agents de ejemplo
        $userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        ];

        // Crear likes para posts
        foreach ($posts as $post) {
            $numberOfLikes = rand(10, 30); // Entre 10 y 30 likes por post

            for ($i = 0; $i < $numberOfLikes; $i++) {
                $ip = $ips[array_rand($ips)];
                $userAgent = $userAgents[array_rand($userAgents)];
                $sessionId = Str::uuid();

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
                $ip = $ips[array_rand($ips)];
                $userAgent = $userAgents[array_rand($userAgents)];
                $sessionId = Str::uuid();

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
