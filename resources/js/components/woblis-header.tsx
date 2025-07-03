import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import WoblisContactModal from './woblis-contact-modal';

export default function WoblisHeader() {
    const { auth } = usePage<SharedData>().props;
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    return (
        <>
        <header className="bg-black text-white py-4 fixed top-0 w-full z-50 border-b border-[#7FFF00]">
            <div className="container mx-auto px-8">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-4">
                        <Link href="/">
                            <img
                                src="/img/woblis.jpg"
                                alt="Woblis Logo"
                                className="h-20 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href={route('welcome')} className="text-gray-300 hover:text-[#7FFF00] transition-colors">
                            INICIO
                        </Link>
                        <Link href={route('how-it-works')} className="text-gray-300 hover:text-[#7FFF00] transition-colors">
                            ¿CÓMO FUNCIONA?
                        </Link>
                        <Link href={route('agencies')} className="text-gray-300 hover:text-[#7FFF00] transition-colors">
                            AGENCIAS
                        </Link>
                        <Link href={route('drivers')} className="text-gray-300 hover:text-[#7FFF00] transition-colors">
                            ¿QUIERES SER WOBLIS?
                        </Link>
                                                    <button
                                onClick={() => setIsContactModalOpen(true)}
                                className="text-gray-300 hover:text-[#7FFF00] transition-colors"
                            >
                                CONTACTO
                            </button>
                        <Link href={route('blog.index')} className="text-gray-300 hover:text-[#7FFF00] transition-colors">
                            WOBLOG
                        </Link>
                    </nav>

                    {/* Right side container */}
                    <div className="flex items-center space-x-6">
                        {/* Auth Links */}
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-[#7FFF00] text-black px-4 py-2 rounded font-semibold hover:bg-[#6FEF00] transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-300 hover:text-[#7FFF00] transition-colors"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-[#7FFF00] text-black px-4 py-2 rounded font-semibold hover:bg-[#6FEF00] transition-colors"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden text-[#7FFF00]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <WoblisContactModal
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
        />
        </>
    );
}
