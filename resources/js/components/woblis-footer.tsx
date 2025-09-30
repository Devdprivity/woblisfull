export default function WoblisFooter() {
    return (
        <footer className="bg-black text-white border-t border-green-400">
            {/* Newsletter Section */}
            <div className="bg-green-400 text-black py-8">
                <div className="container mx-auto px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-2xl font-bold mb-2">Suscríbete</h3>
                            <p className="text-sm">
                                Mantente actualizado con las últimas noticias y insights de movilidad
                            </p>
                        </div>
                        <div className="flex w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Tu email aquí..."
                                className="px-4 py-2 rounded-l-lg border border-white outline-none text-white flex-1 md:w-64"
                            />
                            <button className="bg-black text-[#7fff00] px-6 py-2 rounded-r-lg font-semibold hover:bg-gray-800 transition-colors">
                                Suscribirse
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="py-12">
                <div className="container mx-auto px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div>
                            <h4 className="text-[#7fff00] text-xl font-bold mb-4">Zenit</h4>
                            <p className="text-sm text-gray-300 mb-4">
                                Transformando datos de movilidad en insights accionables para
                                crear ciudades más inteligentes y eficientes.
                            </p>
                            <div className="text-sm text-gray-400">
                                <p>© 2025 Zenit. Todos los derechos reservados.</p>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h5 className="text-[#7fff00] font-semibold mb-4">Enlaces Rápidos</h5>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-300 hover:text-[#7fff00]">Inicio</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-[#7fff00]">Acerca de</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-[#7fff00]">Servicios</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-[#7fff00]">Precios</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-[#7fff00]">Contacto</a></li>
                            </ul>
                        </div>

                        {/* Solutions */}
                        <div>
                            <h5 className="text-[#7fff00] font-semibold mb-4">Soluciones</h5>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-300 hover:text-[#7fff00]">Análisis de Rutas</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-[#7fff00]">Gestión de Flotas</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-[#7fff00]">Smart Cities</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-[#7fff00]">APIs</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-[#7fff00]">Consultoría</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h5 className="text-[#7fff00] font-semibold mb-4">Legal</h5>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-300 hover:text-[#7fff00]">Política de Privacidad</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-[#7fff00]">Términos de Servicio</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-[#7fff00]">Cookies</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-[#7fff00]">GDPR</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-[#7fff00]">Soporte</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 py-4">
                <div className="container mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                        <div>
                            Hecho con ❤️ para el futuro de la movilidad urbana
                        </div>
                        <div className="flex space-x-4 mt-2 md:mt-0">
                            <span className="text-[#7fff00]">🌍</span>
                            <span>Versión 2.1.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
