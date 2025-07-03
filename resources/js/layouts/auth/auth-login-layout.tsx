import { type ReactNode, useState, useEffect } from 'react';

interface AuthLoginLayoutProps {
    children: ReactNode;
    title: string;
    description: string;
}

export default function AuthLoginLayout({ children, title, description }: AuthLoginLayoutProps) {
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [videoError, setVideoError] = useState(false);

    useEffect(() => {
        // Preload video
        const video = document.createElement('video');
        video.src = '/video/bglogin.mp4';
        video.onloadeddata = () => setVideoLoaded(true);
        video.onerror = () => setVideoError(true);
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black">
            {/* Video Background */}
            <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
                {!videoError ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        onLoadedData={() => setVideoLoaded(true)}
                        onError={() => setVideoError(true)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    >
                        <source src="/video/bglogin.mp4" type="video/mp4" />
                    </video>
                ) : null}

                {/* Fallback background mejorado */}
                <div
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{
                        zIndex: videoError ? 1 : -1,
                        background: `
                            linear-gradient(135deg,
                                rgba(0, 0, 0, 0.9) 0%,
                                rgba(20, 20, 20, 0.8) 25%,
                                rgba(127, 255, 0, 0.1) 50%,
                                rgba(20, 20, 20, 0.8) 75%,
                                rgba(0, 0, 0, 0.9) 100%
                            ),
                            radial-gradient(circle at 30% 30%, rgba(127, 255, 0, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 70% 70%, rgba(127, 255, 0, 0.1) 0%, transparent 50%)
                        `
                    }}
                />
            </div>

            {/* Dark overlay para mejor legibilidad */}
            <div
                className="fixed inset-0 bg-black/50"
                style={{ zIndex: 1 }}
            />

            {/* Content */}
            <div
                className="relative min-h-screen flex items-center justify-start px-8 py-12"
                style={{ zIndex: 10 }}
            >
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <img
                            src="/img/logoWoblis.png"
                            alt="Woblis Logo"
                            className="h-16 w-auto mx-auto mb-4"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                        <p className="text-gray-300 text-sm">{description}</p>
                    </div>

                    {/* Translucent Card */}
                    <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-8 shadow-2xl">
                        {children}
                    </div>

                    {/* Additional branding */}
                    <div className="text-center mt-8">
                        <p className="text-gray-400 text-xs">
                            © 2025 Woblis. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side decorative elements */}
            <div
                className="absolute top-1/2 right-8 transform -translate-y-1/2 hidden lg:block"
                style={{ zIndex: 10 }}
            >
                <div className="text-right text-white">
                    <h2 className="text-4xl font-bold mb-4">
                        Bienvenido a <span className="text-[#7FFF00]">Woblis</span>
                    </h2>
                    <p className="text-lg text-gray-300 max-w-md">
                        261,000 viajes al día.<br />
                        Woblis los convierte en Insights
                    </p>
                </div>
            </div>


        </div>
    );
}