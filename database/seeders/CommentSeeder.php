<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\Comment;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = Post::all();

        $authors = [
            ['name' => 'María González', 'email' => 'maria.gonzalez@email.com'],
            ['name' => 'Carlos Rodríguez', 'email' => 'carlos.rodriguez@gmail.com'],
            ['name' => 'Ana Martínez', 'email' => 'ana.martinez@empresa.com'],
            ['name' => 'Diego López', 'email' => 'diego.lopez@startup.co'],
            ['name' => 'Laura Fernández', 'email' => 'laura.fernandez@agency.com'],
            ['name' => 'Roberto Silva', 'email' => 'roberto.silva@consultant.com'],
            ['name' => 'Patricia Jiménez', 'email' => 'patricia.jimenez@marketing.es'],
            ['name' => 'Andrés Morales', 'email' => 'andres.morales@tech.com'],
            ['name' => 'Carmen Ruiz', 'email' => 'carmen.ruiz@business.net'],
            ['name' => 'Miguel Torres', 'email' => 'miguel.torres@digital.co'],
        ];

        $commentTemplates = [
            'Excelente artículo, muy útil para entender las tendencias actuales. Me ayudó mucho en mi estrategia de negocio.',
            'Información muy valiosa. ¿Podrían profundizar más sobre la implementación práctica de estas ideas?',
            'Totalmente de acuerdo con los puntos mencionados. En mi empresa hemos notado estos cambios también.',
            'Gracias por compartir esta perspectiva. Me gustaría saber más sobre casos de estudio específicos.',
            'Muy buen análisis. ¿Tienen más contenido sobre este tema? Me interesa seguir aprendiendo.',
            'Interesante enfoque. Creo que esto se alinea perfectamente con lo que estamos viendo en el mercado.',
            'Contenido de calidad como siempre. Sus artículos son una referencia en la industria.',
            'Me encanta cómo explican conceptos complejos de manera sencilla. ¡Seguiré leyendo!',
            '¿Podrían hacer un seguimiento de este artículo en algunos meses? Sería genial ver la evolución.',
            'Aplicamos algunas de estas estrategias en nuestro negocio y los resultados han sido excelentes.',
            'Como emprendedor, encuentro muy valiosos estos insights. ¡Gracias por el contenido!',
            'Excelente trabajo de investigación. Las fuentes que mencionan son muy confiables.',
            'Me parece que faltan algunos aspectos importantes, pero en general es un buen artículo.',
            'Perfecto timing para este artículo. Justo estábamos discutiendo estos temas en nuestra empresa.',
            'La información está muy bien estructurada y es fácil de seguir. ¡Felicitaciones!',
        ];

        $ips = [
            '192.168.1.1', '10.0.0.1', '172.16.0.1', '203.0.113.1', '198.51.100.1',
            '192.0.2.1', '203.0.113.50', '198.51.100.50', '192.168.1.50', '10.0.0.50',
            '172.16.0.50', '203.0.113.100', '198.51.100.100', '192.168.1.100', '10.0.0.100',
        ];

        foreach ($posts as $post) {
            // Crear 5 comentarios por post
            for ($i = 0; $i < 5; $i++) {
                $author = $authors[array_rand($authors)];
                $comment = $commentTemplates[array_rand($commentTemplates)];

                // Variar algunos comentarios para hacerlos más específicos
                if (rand(1, 3) === 1) {
                    $specificComments = [
                        "En mi experiencia con {$post->title}, he notado que " . strtolower($comment),
                        "Este artículo sobre " . strtolower($post->title) . " me recordó a un proyecto similar que tuvimos. " . $comment,
                        "Relacionado con el tema de " . strtolower($post->title) . ", " . strtolower($comment),
                    ];
                    $comment = $specificComments[array_rand($specificComments)];
                }

                Comment::create([
                    'post_id' => $post->id,
                    'author_name' => $author['name'],
                    'author_email' => $author['email'],
                    'ip_address' => $ips[array_rand($ips)],
                    'content' => $comment,
                    'status' => ['approved', 'approved', 'approved', 'pending', 'rejected'][array_rand(['approved', 'approved', 'approved', 'pending', 'rejected'])], // 60% aprobados
                    'likes_count' => rand(0, 15),
                    'created_at' => now()->subDays(rand(1, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59)),
                    'updated_at' => now()->subDays(rand(0, 5)),
                ]);
            }

            // Actualizar el contador de comentarios del post
            $post->update([
                'comments_count' => $post->comments()->where('status', 'approved')->count()
            ]);
        }

        $this->command->info('Se crearon ' . (count($posts) * 5) . ' comentarios para ' . count($posts) . ' posts.');
    }
}
