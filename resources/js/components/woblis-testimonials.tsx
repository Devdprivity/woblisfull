export default function WoblisTestimonials() {
    return (
        <section className="bg-black text-white py-16">
            <div className="container mx-auto px-8 flex justify-center">
                <div className="max-w-4xl">
                    <h2 className="text-[#7fff00] text-4xl font-bold mb-8 text-center">
                        Tasa de respuesta alta, sin presión. Solo con incentivos
                    </h2>

                    <div className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-[#7fff00] text-2xl font-semibold mb-4">
                                    Metodología no intrusiva
                                </h3>
                                <p className="text-lg leading-relaxed">
                                    Nuestro enfoque se basa en incentivos positivos en lugar de presión.
                                    Ofrecemos recompensas tangibles a los usuarios que participan en
                                    nuestras encuestas y estudios, creando una experiencia gratificante
                                    que fomenta la participación voluntaria y auténtica.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-[#7fff00] text-2xl font-semibold mb-4">
                                    Resultados comprobados
                                </h3>
                                <p className="text-lg leading-relaxed">
                                    Nuestro sistema de incentivos ha demostrado generar tasas de
                                    respuesta superiores al 85%, muy por encima del promedio de la
                                    industria. Esto se traduce en datos más representativos y
                                    insights más precisos para nuestros clientes.
                                </p>
                            </div>
                        </div>

                        <div className="border-l-4 border-green-400 pl-6 py-4">
                            <blockquote className="text-xl italic">
                                "Woblis ha transformado la forma en que recopilamos feedback de nuestros usuarios.
                                La calidad y cantidad de respuestas que obtenemos ahora es excepcional."
                            </blockquote>
                            <cite className="text-[#7fff00] font-semibold mt-2 block">
                                - Director de Operaciones, TransMetro
                            </cite>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 pt-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#7fff00] mb-2">85%</div>
                                <p className="text-sm">Tasa de respuesta promedio</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#7fff00] mb-2">72h</div>
                                <p className="text-sm">Tiempo promedio de respuesta</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#7fff00] mb-2">4.8/5</div>
                                <p className="text-sm">Satisfacción del usuario</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
