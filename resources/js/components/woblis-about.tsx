export default function WoblisAbout() {
    return (
        <section className="bg-black text-white py-16">
            <div className="container mx-auto px-8">
                <div className="flex justify-between items-start">
                    <div className="max-w-2xl">
                        <h2 className=" text-[#7fff00]  text-4xl font-bold mb-8">
                            Acerca de Woblis
                        </h2>

                    <div className="text-lg leading-relaxed space-y-6">
                        <p>
                            Woblis es una plataforma integral de insights de movilidad que transforma datos de
                            transporte en información accionable para empresas, gobiernos y organizaciones.
                            Nuestra tecnología avanzada analiza patrones de movimiento, comportamientos de
                            usuarios y tendencias de transporte para proporcionar una comprensión profunda
                            del panorama de la movilidad urbana.
                        </p>

                        <p>
                            Con más de 261,000 viajes procesados diariamente, Woblis ofrece una perspectiva
                            única sobre cómo las personas se mueven en las ciudades, permitiendo tomar
                            decisiones informadas basadas en datos reales y actualizados en tiempo real.
                        </p>

                            <p>
                                Nuestra misión es democratizar el acceso a insights de movilidad de alta calidad,
                                facilitando la creación de ciudades más inteligentes, sostenibles y eficientes.
                            </p>
                        </div>
                    </div>

                    <div className="w-1/3">
                        <img
                            src="/img/woblis.jpg"
                            alt="Woblis"
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
