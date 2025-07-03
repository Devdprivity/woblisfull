import { useState } from 'react';
import WoblisHeader from './woblis-header';
import WoblisFooter from './woblis-footer';

export default function WoblisDrivers() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        ciudad: '',
        mensaje: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Formulario enviado:', formData);
        // Aquí iría la lógica de envío
    };

    const steps = [
        {
            number: "1",
            title: "Ofrece tu encuesta",
            description: "Conecta tu móvil con pasajeros que esperan en Lift."
        },
        {
            number: "2",
            title: "El pasajero responde",
            description: "Realiza durante el trayecto en 3-5 minutos. Los datos van."
        },
        {
            number: "3",
            title: "Validamos tu respuesta",
            description: "Revisamos que todo este correcto antes de eliminar."
        },
        {
            number: "4",
            title: "Tu ganas por cada encuesta",
            description: "Recibes un pago por encuesta realizada y validada."
        },
        {
            number: "5",
            title: "Recibes algo más respuesta validada",
            description: "Recibe incentivo por cada respuesta validada y pago por encuesta."
        }
    ];

    const requirements = [
        "Licencia de conducir vigente",
        "Experiencia como conductor de app o transporte urbano",
        "Buena presencia y trato amable",
        "Acceso a internet para ver las pagos y encuestas",
        "Tiempo y motivación para generar ingresos de forma honesta y fácil"
    ];

    return (
        <div className="min-h-screen bg-black">
            <WoblisHeader />

            {/* Hero Section */}
            <section className="pt-20 pb-16 bg-black text-white">
                <div className="container mx-auto px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Image */}
                        <div className="lg:w-1/3">
                            <div className="relative">
                                <img
                                    src="/img/satici.jpg"
                                    alt="Conductor Woblis"
                                    className="w-full rounded-lg shadow-2xl"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="lg:w-2/3">
                            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                                <span className="text-[#7FFF00]">¿Quieres ser parte de Woblis</span>
                                <span className="text-white"> y ganar más mientras manejas?</span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-4">
                                Si trabajas en Uber, Cabify, DiDi o en transporte privado, esto es para ti.
                            </p>

                            <p className="text-lg text-gray-400 mb-8">
                                Con Woblis, ganas dinero extra solo por ofrecer una encuesta a tus pasajeros.
                            </p>

                            <button className="bg-[#7FFF00] text-black px-8 py-4 rounded-lg text-lg font-bold hover:bg-[#6FEF00] transition-colors">
                                OBTÉN MÁS INFORMACIÓN
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-black">
                <div className="container mx-auto px-8">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">
                        <span className="text-[#7FFF00]">¿Cómo funciona?</span>
                    </h2>

                    <div className="max-w-4xl mx-auto">
                        {steps.map((step, index) => (
                            <div key={index} className={`flex items-start gap-8 mb-16 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                                {/* Step Number Bubble */}
                                <div className="flex-shrink-0">
                                    <div className="relative">
                                        <div className="w-20 h-16 bg-[#7FFF00] rounded-2xl flex items-center justify-center">
                                            <span className="text-black text-3xl font-bold">{step.number}</span>
                                        </div>
                                        {/* Speech bubble tail */}
                                        <div className={`absolute top-6 w-0 h-0 ${
                                            index % 2 === 0
                                                ? '-right-2 border-l-8 border-l-[#7FFF00] border-t-4 border-t-transparent border-b-4 border-b-transparent'
                                                : '-left-2 border-r-8 border-r-[#7FFF00] border-t-4 border-t-transparent border-b-4 border-b-transparent'
                                        }`}></div>
                                    </div>
                                </div>

                                {/* Step Content */}
                                <div className={`flex-1 ${index % 2 === 1 ? 'text-right' : ''}`}>
                                    <h3 className="text-white text-2xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements */}
            <section className="py-20 bg-gray-900">
                <div className="container mx-auto px-8">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">
                        <span className="text-[#7FFF00]">Lo que necesitas</span> <span className="text-white">para postular</span>
                    </h2>

                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
                        {requirements.map((requirement, index) => (
                            <div key={index} className="flex items-start gap-4 p-6 bg-black rounded-lg">
                                <div className="flex-shrink-0 w-8 h-8 bg-[#7FFF00] rounded-full flex items-center justify-center">
                                    <span className="text-black font-bold text-lg">{index + 1}</span>
                                </div>
                                <p className="text-white text-lg">{requirement}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Earnings */}
            <section className="py-20 bg-black">
                <div className="container mx-auto px-8 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-12">
                        <span className="text-[#7FFF00]">¿Cuánto gano?</span>
                    </h2>

                    <div className="max-w-2xl mx-auto">
                        <ul className="text-left text-lg text-gray-300 space-y-4 mb-12">
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-[#7FFF00] rounded-full mt-3 flex-shrink-0"></div>
                                <span>Ganas dinero por encuesta completada</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-[#7FFF00] rounded-full mt-3 flex-shrink-0"></div>
                                <span>Recibe un pago por encuesta realizada</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-[#7FFF00] rounded-full mt-3 flex-shrink-0"></div>
                                <span>Incentivo extra por calidad de datos</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA with QR */}
            <section className="py-20 bg-gray-900">
                <div className="container mx-auto px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-2/3 text-center lg:text-left">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
                                <span className="text-white">Tú manejas. Ellos responden.</span>
                                <br />
                                <span className="text-[#7FFF00]">Todos ganan.</span>
                            </h2>
                        </div>

                        <div className="lg:w-1/3">
                            <div className="w-48 h-48 bg-[#7FFF00] rounded-lg flex items-center justify-center mx-auto">
                                <div className="w-40 h-40 bg-black rounded grid grid-cols-8 gap-px p-2">
                                    {Array.from({ length: 64 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-full h-full ${Math.random() > 0.5 ? 'bg-[#7FFF00]' : 'bg-transparent'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Form */}
            <section className="py-20 bg-black">
                <div className="container mx-auto px-8">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12">
                            <span className="text-[#7FFF00]">¡Trabaja con nosotros!</span>
                        </h2>

                        <p className="text-center text-gray-300 text-lg mb-8">
                            Únete a nuestra equipo
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="text"
                                        name="nombre"
                                        placeholder="Nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-[#7FFF00] focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="apellido"
                                        placeholder="Apellido"
                                        value={formData.apellido}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-[#7FFF00] focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        placeholder="Teléfono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-[#7FFF00] focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-[#7FFF00] focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    name="ciudad"
                                    placeholder="Ciudad"
                                    value={formData.ciudad}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-[#7FFF00] focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <textarea
                                    name="mensaje"
                                    placeholder="Mensaje"
                                    rows={4}
                                    value={formData.mensaje}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-[#7FFF00] focus:outline-none resize-none"
                                ></textarea>
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="bg-[#7FFF00] text-black px-8 py-4 rounded-lg text-lg font-bold hover:bg-[#6FEF00] transition-colors"
                                >
                                    ENVIAR SOLICITUD
                                </button>
                            </div>
                        </form>

                        <p className="text-center text-gray-500 text-sm mt-6">
                            * Al enviar este formulario, aceptas nuestros términos de servicios y política de privacidad.
                        </p>
                    </div>
                </div>
            </section>

            <WoblisFooter />
        </div>
    );
}
