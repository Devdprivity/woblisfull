import { useState } from 'react';

interface WoblisContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WoblisContactModal({ isOpen, onClose }: WoblisContactModalProps) {
    const [activeTab, setActiveTab] = useState<'email' | 'whatsapp'>('email');
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        empresa: '',
        mensaje: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            alert('¡Mensaje enviado exitosamente! Te contactaremos pronto.');
            setIsLoading(false);
            setFormData({ nombre: '', email: '', telefono: '', empresa: '', mensaje: '' });
            onClose();
        }, 2000);
    };

    const handleWhatsAppContact = () => {
        const phoneNumber = "56983517910";
        const message = `Hola! Me interesa conocer más sobre los servicios de Woblis.

Nombre: ${formData.nombre}
Email: ${formData.email}
Empresa: ${formData.empresa || 'No especificada'}

${formData.mensaje || 'Me gustaría recibir más información.'}`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-[#7FFF00]">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Contáctanos</h2>
                        <p className="text-gray-400 mt-1">¿Cómo prefieres que te contactemos?</p>
                    </div>

                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex border-b border-gray-700">
                    <button
                        onClick={() => setActiveTab('email')}
                        className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                            activeTab === 'email'
                                ? 'text-[#7FFF00] border-b-2 border-[#7FFF00] bg-gray-800'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-3">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            Email
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveTab('whatsapp')}
                        className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                            activeTab === 'whatsapp'
                                ? 'text-[#7FFF00] border-b-2 border-[#7FFF00] bg-gray-800'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-3">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                            </svg>
                            WhatsApp
                        </div>
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'email' ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-[#7FFF00] focus:outline-none transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-[#7FFF00] focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-[#7FFF00] focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Empresa</label>
                                    <input
                                        type="text"
                                        name="empresa"
                                        value={formData.empresa}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-[#7FFF00] focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje *</label>
                                <textarea
                                    name="mensaje"
                                    rows={4}
                                    value={formData.mensaje}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-[#7FFF00] focus:outline-none transition-colors resize-none"
                                    placeholder="Cuéntanos sobre tu proyecto o consulta..."
                                    required
                                ></textarea>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-[#7FFF00] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#6FEF00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                            </svg>
                                            Enviar mensaje
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="w-24 h-24 bg-[#25D366] rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                                </svg>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Contáctanos por WhatsApp</h3>
                                <p className="text-gray-400 mb-6">Respuesta inmediata a tus consultas</p>
                            </div>

                            <div className="space-y-4 max-w-sm mx-auto">
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Tu nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-[#7FFF00] focus:outline-none transition-colors"
                                />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Tu email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-[#7FFF00] focus:outline-none transition-colors"
                                />

                                <input
                                    type="text"
                                    name="empresa"
                                    placeholder="Tu empresa (opcional)"
                                    value={formData.empresa}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-[#7FFF00] focus:outline-none transition-colors"
                                />

                                <textarea
                                    name="mensaje"
                                    rows={3}
                                    placeholder="Mensaje (opcional)"
                                    value={formData.mensaje}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-[#7FFF00] focus:outline-none transition-colors resize-none"
                                ></textarea>
                            </div>

                            <button
                                onClick={handleWhatsAppContact}
                                className="bg-[#25D366] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#20B954] transition-colors flex items-center gap-3 mx-auto"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                                </svg>
                                Abrir WhatsApp
                            </button>

                            <p className="text-gray-500 text-sm">+56 9 8351 7910</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
