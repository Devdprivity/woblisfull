export default function WoblisHowItWorks() {
    const steps = [
        {
            title: "Conecta con pasajeros",
            description: "Utiliza nuestra app para conectar con pasajeros que están dispuestos a participar en encuestas durante su viaje.",
            icon: "🔗"
        },
        {
            title: "Realiza la encuesta",
            description: "Durante el trayecto, el pasajero completa una breve encuesta de 3-5 minutos en tu dispositivo.",
            icon: "📝"
        },
        {
            title: "Validación automática",
            description: "Nuestro sistema valida automáticamente las respuestas para asegurar la calidad de los datos.",
            icon: "✅"
        },
        {
            title: "Recibe tu pago",
            description: "Por cada encuesta completada y validada, recibes un pago directo a tu cuenta.",
            icon: "💰"
        }
    ];

    return (
        <div className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-[#7FFF00]">¿Cómo funciona</span>
                        <span className="text-white"> Woblis?</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Descubre cómo puedes ganar dinero extra mientras realizas tus viajes habituales
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-gray-900 rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl mb-4">{step.icon}</div>
                            <h3 className="text-[#7FFF00] text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-gray-400">{step.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="bg-[#7FFF00] text-black px-8 py-4 rounded-lg text-lg font-bold hover:bg-[#6FEF00] transition-colors">
                        COMIENZA AHORA
                    </button>
                </div>
            </div>
        </div>
    );
}
