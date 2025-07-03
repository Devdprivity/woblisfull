<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Post;
use Carbon\Carbon;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = [
            [
                'title' => 'Tendencias del consumidor para el 2030',
                'slug' => 'tendencias-del-consumidor-para-el-2030',
                'excerpt' => 'Consumidor 2030: lo que tu marca tiene que saber desde ya. Descubre las 5 tendencias que van a definir cómo compramos, consumimos y nos relacionamos con las marcas en la próxima década.',
                'content' => '🔮 Tendencias del consumidor para el 2030

Consumidor 2030: lo que tu marca tiene que saber desde ya

1. Internet de los sentidos: lo digital se va a sentir real
La tecnología no se va a quedar solo en lo visual. Se espera que, para 2030, puedas oler, tocar o incluso saborear digitalmente gracias a redes sensoriales, realidad aumentada y experiencias inmersivas. Ericsson ya lo llama el "Internet de los sentidos".

¿Y qué significa esto para las marcas?

• Podrías probarte ropa desde el celu, sintiendo textura y ajuste.
• La publicidad ya no será solo visual o auditiva, sino sensorial y emocional.

2. Consumidores más conscientes, exigentes y éticos
La nueva generación no compra cualquier cosa. Busca marcas que se la jueguen por la sostenibilidad, el trato justo, la diversidad y la coherencia.

¿Qué implica esto para tu negocio?

• Mostrar tus valores reales, no puro marketing.
• Preferir insumos reciclables, locales o con trazabilidad clara.

3. Identidad fluida: el fin de las etiquetas clásicas
Género, edad, profesión, estilo de vida... cada vez son menos definitivos. La gente quiere verse reflejada en marcas que entiendan su realidad compleja y cambiante.

Clave para el contenido y los productos:

• Ser más inclusivo en el lenguaje, el diseño y la experiencia.
• Abrirse a públicos nuevos, sin asumir estereotipos.

4. Tecnología invisible, pero ultra útil
Las personas ya no quieren apps nuevas, sino soluciones que funcionen sin interrumpir. Todo lo que simplifique sin notarse, gana: pagos automáticos, asistentes de voz, integración con dispositivos del hogar o ropa.

¿Qué deberías estar haciendo hoy?

• Diseñar experiencias simples, rápidas y sin fricción.
• Usar herramientas que automaticen tareas sin que el usuario se dé cuenta.

5. Economía circular y reconexión con lo local
Para el 2030, comprar sin generar residuos o apoyar negocios que reutilizan va a ser la norma, no la excepción. La circularidad se viene fuerte: reparar, intercambiar, reciclar, compartir.

¿Cómo sumarse?

• Programas de reciclaje de productos usados.
• Envíos sin plásticos, y colaboraciones con emprendimientos locales.

✅ ¿Y ahora qué?
• Levanta insights reales con Woblis en terreno: qué esperan tus clientes del futuro y cómo se mueven hoy.
• Diseña experiencias híbridas, que conecten el mundo físico y digital sin fricciones.
• Actualiza tu propuesta de valor para incluir propósito, accesibilidad y coherencia.

📍 Fórmula que funciona:
Tendencia + datos reales = decisiones con visión de futuro.

📚 Fuentes consultadas:
• Ericsson: 10 Hot Consumer Trends for 2030
• Mintel: Global Consumer Trends 2030
• Dentsu: Consumer Vision 2030
• Retail Economics: 40 Retail Trends to 2030
• Wikipedia: Sustainable consumer behaviour',
                'featured_image' => null,
                'author_name' => 'Woblis Team',
                'author_email' => 'team@woblis.com',
                'meta_data' => [
                    'tags' => ['tendencias', 'consumidor', '2030', 'futuro', 'tecnología', 'sostenibilidad'],
                    'category' => 'tendencias'
                ],
                'status' => 'published',
                'views_count' => rand(150, 500),
                'likes_count' => rand(20, 80),
                'comments_count' => 0,
                'published_at' => Carbon::create(2025, 6, 10, 9, 0, 0),
            ],
            [
                'title' => '¿Pa\' Dónde Vamos?',
                'slug' => 'pa-donde-vamos',
                'excerpt' => 'Guía pa\' emprendedores que no quieren quedar botados a medio camino. Conoce las 5 etapas por las que pasa una pyme y cómo no rendirte cuando la cosa se pone cuesta arriba.',
                'content' => '🧭 ¿Pa\' Dónde Vamos?

Guía pa\' emprendedores que no quieren quedar botados a medio camino

Emprender no es solo vender algo: es bancarse los bajones, tomar decisiones con poca plata, poco tiempo y hartas ganas. Aunque en redes pareciera que a todos les va la raja, la verdad es que la mayoría de las pymes chicas (entre 2 y 5 personas) tienen que aperrar todos los días pa\' no quedarse pegás.

Si estay en esa parada, esta guía es pa\' ti. Acá te contamos las etapas por las que pasa un negocio, dónde se suelen estancar, y cómo no rendirte cuando la cuestión se pone cuesta arriba.

🚦 Etapas por las que pasa una pyme (y cuándo se pone cuática la cosa)
Según el modelo clásico de Churchill & Lewis (sí, de Harvard, pero sirve), hay 5 etapas típicas en el camino de una empresa:

1. Existencia
Sobrevivir. Validar tu idea, vender algo, conseguir tus primeros clientes.

2. Supervivencia
Que la empresa funcione sin morirse. Hay plata entrando, pero todo está al filo.

3. Éxito
Empieza a sobrar un poco. Tenís que decidir: ¿me quedo así o me la juego por crecer?

4. Despegue
Delegar, contratar, escalar. Acá podís crecer caleta… o explotar si no lo hacís bien.

5. Madurez
Te afirmaste. Ya tenís procesos, equipo y la cosa funciona como empresa "de verdad".

🎯 Dato clave: muchas pymes chilenas se quedan pegás entre la etapa 2 y 3. Venden, pagan los sueldos, pero no logran escalar ni ordenar la casa.

⚠️ ¿Dónde se echa a perder la micro?
Los errores se repiten harto, y si los conocís de antemano, te podís ahorrar más de un cagazo.

1. No cachar el mercado
Pensar que todos necesitan tu producto no basta. Hay que salir a la calle, hablar con clientes reales y entender qué problema estáis resolviendo de verdad.

2. Mezclar las lucas
Meter en la misma cuenta la plata del negocio y la tuya es receta pa\' el desastre. Parte separando bien los gastos y controlando el flujo de caja.

3. Querer hacerlo todo solo
Si estay vendiendo, haciendo las boletas, manejando redes y además entregando pedidos, no vas a durar. Busca gente que te complemente o externaliza algunas cosas.

4. No escuchar al cliente
Creer que te las sabís todas es peligroso. Los clientes cambian, el mercado cambia. Si no te adaptai, te quedai fuera.

5. No mirar los números
Sin métricas, andai a ciegas. Tenís que saber cuánto te cuesta conseguir un cliente, cuál producto te deja más margen, y cuánto podís invertir sin quedar pato.

💪 Consejos pa\' no bajarte del carro
• Ten claro tu "por qué": eso es lo que te va a mantener firme cuando la cosa se ponga peluda.
• Haz red con otros emprendedores: compartir experiencias te ayuda a aprender y no sentirte solo.
• Adáptate rápido: no te encariñís con tu idea si no está funcionando. Ajusta el rumbo sin miedo.
• Celebra los logros chicos: todo suma. Hasta cerrar una venta en un día lento te puede levantar el ánimo.
• Informa tus decisiones: los datos valen oro. Con la info correcta, no necesitai adivinar.

📍 Pa\' cerrar
Emprender es duro, sí. Pero también es una tremenda oportunidad si lo hacís con cabeza y no te dejai llevar por la ansiedad o el ruido de afuera. Si ya estai remando, no te soltís del remo. Pero eso sí: aprendí a remar mejor.

Y si querís cachar cómo levantar datos reales, entender mejor a tus clientes y tomar decisiones con más base…
Conversemos. En Woblis estamos pa\' apoyarte.

📚 Fuentes:
• Zendesk – Las 5 etapas del crecimiento empresarial
• Ecosistema Startup – Errores comunes de emprendedores
• Workcafé Santander – Emprendimiento y finanzas
• Workcafé Santander – 6 errores financieros frecuentes
• Revista Paideia – Emprendimiento desde cero',
                'featured_image' => null,
                'author_name' => 'Woblis Team',
                'author_email' => 'team@woblis.com',
                'meta_data' => [
                    'tags' => ['emprendimiento', 'pyme', 'chile', 'consejos', 'negocios', 'startups'],
                    'category' => 'emprendimiento'
                ],
                'status' => 'published',
                'views_count' => rand(200, 600),
                'likes_count' => rand(30, 90),
                'comments_count' => 0,
                'published_at' => Carbon::create(2025, 6, 9, 10, 30, 0),
            ],
            [
                'title' => 'Ecommerce chileno 2025: señales claras de recuperación',
                'slug' => 'ecommerce-chileno-2025-senales-claras-de-recuperacion',
                'excerpt' => 'La CCS reportó ventas digitales por más de US$ 2.500 millones en el primer cuatrimestre. Pero entender el "por qué" detrás del crecimiento es clave para lo que viene.',
                'content' => 'Ecommerce chileno 2025: señales claras de recuperación

No es solo cuánto vendes, es por qué te eligen

La CCS reportó ventas digitales por más de US$ 2.500 millones en el primer cuatrimestre. Pero entender el "por qué" detrás del crecimiento es clave para lo que viene.

La Cámara de Comercio de Santiago (CCS) lo dejó claro: el ecommerce chileno se está recuperando con fuerza. En los primeros cuatro meses de 2025, se vendieron más de US$ 2.500 millones en plataformas digitales. Esto no solo marca una recuperación post-crisis, sino que plantea nuevos desafíos para marcas, retailers y emprendedores.

📊 ¿Qué dicen los datos?
• +10% en unidades vendidas respecto al mismo período de 2024.
• Ticket promedio bajó un 3%, señal de mayor sensibilidad al precio.
• Categorías como ropa, tecnología y alimentos siguen liderando.
• Las proyecciones apuntan a que 2025 podría igualar los mejores años del ecommerce en Chile.

Los datos reflejan un consumidor activo, pero más exigente y racional.

👀 ¿Qué deberían observar las marcas?
• Volumen ≠ comportamiento. Las ventas crecieron, pero con decisiones más reflexivas.
• Contexto territorial. Las preferencias varían según la comuna, el trayecto, el estilo de vida.
• Omnicanalidad real. Las marcas que integran bien lo digital y lo presencial, están un paso adelante.

💡 Lo que viene: decisiones con datos reales, no supuestos
La oportunidad no está solo en saber cuánto se vendió, sino en entender por qué se vendió. Y eso exige una lectura más cercana a la calle, a lo que pasa entre pantalla y realidad.

¿Y cómo logramos eso?
En Woblis ayudamos a las marcas a detectar patrones, percepciones y oportunidades en movimiento, justo en el trayecto donde el consumidor decide.

¿Quieres entender mejor a tu audiencia?',
                'featured_image' => null,
                'author_name' => 'Woblis Team',
                'author_email' => 'team@woblis.com',
                'meta_data' => [
                    'tags' => ['ecommerce', 'chile', 'ventas', 'ccs', 'retail', 'tendencias'],
                    'category' => 'ecommerce'
                ],
                'status' => 'published',
                'views_count' => rand(100, 400),
                'likes_count' => rand(15, 60),
                'comments_count' => 0,
                'published_at' => Carbon::create(2025, 6, 8, 8, 0, 0),
            ],
        ];

        foreach ($posts as $postData) {
            Post::create($postData);
        }
    }
}
