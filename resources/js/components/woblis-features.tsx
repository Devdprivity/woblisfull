export default function WoblisFeatures() {
    const features = [
        {
            title: "Captura Full Continua",
            description: "Registramos de forma continua todos los aspectos del viaje, desde el origen hasta el destino, capturando cada detalle que puede influir en la experiencia de movilidad."
        },
        {
            title: "Feedback Directo",
            description: "Los usuarios pueden proporcionar retroalimentación instantánea sobre su experiencia de viaje, creando un flujo constante de información cualitativa valiosa."
        },
        {
            title: "Tracking Smart Pasajeros",
            description: "Nuestro sistema de seguimiento inteligente monitorea patrones de comportamiento y preferencias de los pasajeros sin comprometer su privacidad."
        },
        {
            title: "Objeto valor Mapping",
            description: "Transformamos datos brutos en mapas de valor que identifican oportunidades de mejora y optimización en el sistema de transporte."
        },
        {
            title: "Real-time Competitive Intelligence",
            description: "Proporcionamos inteligencia competitiva en tiempo real, permitiendo comparaciones con otros sistemas de transporte y benchmarking continuo."
        },
        {
            title: "Localización GIS Inteligente",
            description: "Utilizamos tecnología GIS avanzada para proporcionar localización precisa y análisis espacial detallado de patrones de movilidad."
        }
    ];

    return (
        <section className="bg-black text-[#7fff00] py-16">
            <div className="container mx-auto px-8">
                <h2 className="text-4xl font-bold text-center mb-4">
                    Inputs accionables, directo desde el terreno.
                </h2>

                <div className="grid md:grid-cols-3 gap-8 mt-16">
                    {features.map((feature, index) => (
                        <div key={index} className="space-y-4">
                            <h3 className="text-xl font-semibold text-[#7fff00]">
                                {feature.title}
                            </h3>
                            <p className="text-white text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16">
                    <img
                        src="/img/satici.jpg"
                        alt="Satici"
                        className="w-full rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
}
