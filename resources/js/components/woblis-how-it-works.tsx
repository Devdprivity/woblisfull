export default function ZenitHowItWorks() {
    const steps = [
        {
            title: "Conecta con pasajeros",
            description: "Utiliza nuestra app para conectar con pasajeros que están dispuestos a participar en encuestas durante su viaje.",
            icon: (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            title: "Realiza la encuesta",
            description: "Durante el trayecto, el pasajero completa una breve encuesta de 3-5 minutos en tu dispositivo.",
            icon: (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            title: "Validación automática",
            description: "Nuestro sistema valida automáticamente las respuestas para asegurar la calidad de los datos.",
            icon: (
                <svg className="w-8 h-8 text-[#7FFF00]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            title: "Recibe tu pago",
            description: "Por cada encuesta completada y validada, recibes un pago directo a tu cuenta.",
            icon: (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
            )
        }
    ];

    return (
        <div className="py-24" style={{ marginTop: '50px' }}>
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-[#7FFF00]">¿Cómo funciona</span>
                        <span className="text-white"> Zenit?</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Descubre cómo puedes ganar dinero extra mientras realizas tus viajes habituales
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-gray-900 rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
                            <div className="flex justify-center mb-4">{step.icon}</div>
                            <h3 className="text-white text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-white text-sm leading-relaxed">{step.description}</p>
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
