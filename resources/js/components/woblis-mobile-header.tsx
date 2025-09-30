import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export default function WoblisMobileHeader() {
    const { auth } = usePage<SharedData>().props;

    return (
        <header className="bg-black text-white py-2 fixed top-0 w-full z-50 border-b border-[#7FFF00] md:hidden">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo Section - más pequeño en móvil */}
                    <div className="flex items-center">
                        <Link href="/">
                            <img
                                src="/img/logoWoblis.png"
                                alt="Zenit Logo"
                                className="h-12 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Auth Links - Simplificados para móvil */}
                    <div className="flex items-center space-x-2">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="bg-[#7FFF00] text-black px-3 py-1 rounded text-sm font-semibold hover:bg-[#6FEF00] transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-gray-300 hover:text-[#7FFF00] transition-colors text-sm"
                                >
                                    Iniciar
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-[#7FFF00] text-black px-3 py-1 rounded text-sm font-semibold hover:bg-[#6FEF00] transition-colors"
                                >
                                    Registro
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
