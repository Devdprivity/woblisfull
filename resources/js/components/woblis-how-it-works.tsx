export default function WoblisHowItWorks() {
    const steps = [
        {
            number: "1",
            title: "Definimos lo que quieres saber",
            description: "Te ayudamos a diseñar tu adaptada tu encuesta para que sea clara, breve y accionable.",
            side: "right"
        },
        {
            number: "2",
            title: "Activamos nuestra red de conductores",
            description: "Seleccionamos drivers cercanos activos y los entrenamos con QR físico para salir a terreno.",
            side: "left"
        },
        {
            number: "3",
            title: "El pasajero escanea y responde",
            description: "Durante el viaje, el conductor ofrece la encuesta. El pasajero accede desde su celular, sin instalar apps ni dejar datos.",
            side: "right"
        },
        {
            number: "4",
            title: "Validamos las respuestas",
            description: "Aplicamos filtros de hora, coherencia y la correspondencia. IP Solo se entrega lo válido.",
            side: "left"
        },
        {
            number: "5",
            title: "Procesamos y entregamos la data",
            description: "En 48 a 72 horas, recibes un informe listo para procesar o analizar. También puedes pedir los datos en bruto.",
            side: "right"
        },
        {
            number: "6",
            title: "Revisamos, aprendemos y repetimos",
            description: "¿Quieres hacer seguimiento, comparar zonas o testear de nuevo? Usamos estos para volver a muestrear.",
            side: "left"
        }
    ];

    return (
        <section className="bg-black text-white py-20 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-96 h-96 bg-[#7fff00] rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
                <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#7fff00] rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-5xl md:text-6xl font-bold mb-8 text-[#7fff00]">
                        ¿Cómo funciona Woblis?
                    </h2>
                </div>

                {/* Steps */}
                <div className="max-w-6xl mx-auto space-y-16">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-12 ${
                                step.side === 'left' ? 'flex-row-reverse' : ''
                            } ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Content */}
                            <div className="flex-1 space-y-4">
                                <h3 className="text-2xl md:text-3xl font-bold text-white">
                                    {step.title}
                                </h3>
                                <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
                                    {step.description}
                                </p>
                            </div>

                            {/* Number Bubble */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-[#7fff00] rounded-3xl blur-xl opacity-30 animate-pulse"></div>

                                    {/* Main bubble */}
                                    <div className="relative w-24 h-24 md:w-32 md:h-32 bg-[#7fff00] rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                                        <span className="text-3xl md:text-4xl font-bold text-white">
                                            {step.number}
                                        </span>
                                    </div>

                                    {/* Chat tail */}
                                    <div className={`absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-green-300 to-green-500 ${
                                        (index % 2 === 0) ? '-right-2 rounded-br-xl' : '-left-2 rounded-bl-xl'
                                    }`}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Message */}
                <div className="text-center mt-20 space-y-8">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold text-[#7fff00] mb-4">
                            Woblis no es una encuesta. Es un sistema de escucha en movimiento.
                        </h3>
                        <p className="text-lg text-gray-300 leading-relaxed mb-8">
                            Te ayudamos a llegar donde tus metodologías no llegaban.
                            <br />
                            Somos tu partner de recolección de datos en ruta, sin apps, sin planillas, sin demoras.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div className="flex justify-center">
                        <button className="bg-gradient-to-r from-green-400 to-green-500 text-black font-bold py-4 px-8 rounded-lg text-lg hover:from-green-300 hover:to-green-400 transform hover:scale-105 transition-all duration-300 shadow-lg">
                            ¡AGENDA UNA REU!
                        </button>
                    </div>
                </div>

                {/* Connecting Lines (optional decoration) */}
                <div className="absolute inset-0 pointer-events-none">
                    {steps.map((_, index) => (
                        index < steps.length - 1 && (
                            <div
                                key={index}
                                className="absolute w-px h-16 bg-gradient-to-b from-green-400/50 to-transparent"
                                style={{
                                    top: `${20 + (index * 12)}%`,
                                    left: '50%',
                                    transform: 'translateX(-50%)'
                                }}
                            />
                        )
                    ))}
                </div>
            </div>
        </section>
    );
}
