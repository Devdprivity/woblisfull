import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { useEffect } from 'react';

export default function MobileNav() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Detectar si es un dispositivo móvil
        const checkIfMobile = () => {
            setIsVisible(window.innerWidth <= 768);
        };

        // Verificar al cargar y al cambiar el tamaño de la ventana
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    if (!isVisible) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50 md:hidden">
            <div className="flex justify-around items-center h-16">
                <Link
                    href="/"
                    className="flex flex-col items-center text-gray-400 hover:text-[#7FFF00]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-xs mt-1">Inicio</span>
                </Link>

                <Link
                    href="/como-funciona"
                    className="flex flex-col items-center text-gray-400 hover:text-[#7FFF00]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs mt-1">¿Cómo?</span>
                </Link>

                <Link
                    href="/agencias"
                    className="flex flex-col items-center text-gray-400 hover:text-[#7FFF00]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-xs mt-1">Agencias</span>
                </Link>

                <Link
                    href="/quieres-ser-woblis"
                    className="flex flex-col items-center text-gray-400 hover:text-[#7FFF00]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs mt-1">Únete</span>
                </Link>

                <Link
                    href="/contacto"
                    className="flex flex-col items-center text-gray-400 hover:text-[#7FFF00]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs mt-1">Contacto</span>
                </Link>
            </div>
        </nav>
    );
}
