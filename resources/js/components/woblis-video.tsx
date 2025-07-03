import { useState, useEffect } from 'react';

interface WoblisVideoProps {
    src?: string;
    className?: string;
}

export default function WoblisVideo({
    src = "/video/costumers.mp4",
    className = "w-full rounded-lg shadow-lg"
}: WoblisVideoProps) {
    const [videoError, setVideoError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState('');

    useEffect(() => {
        console.log('WoblisVideo: Intentando cargar video desde:', src);
        setDebugInfo(`Cargando: ${src}`);
    }, [src]);

    return (
        <div className="relative">
            {!videoError ? (
                <>
                    <video
                        className={className}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onError={(e) => {
                            console.error('ERROR VIDEO:', e);
                            console.error('Ruta del video:', src);
                            setVideoError(true);
                            setDebugInfo(`Error cargando: ${src}`);
                        }}
                        onLoadedData={() => {
                            console.log('VIDEO CARGADO EXITOSAMENTE:', src);
                            setIsLoading(false);
                            setDebugInfo('Video cargado correctamente');
                        }}
                        onLoadStart={() => {
                            console.log('VIDEO: Iniciando carga...', src);
                            setIsLoading(true);
                            setDebugInfo('Iniciando carga...');
                        }}
                        onCanPlay={() => {
                            console.log('VIDEO: Puede reproducirse');
                            setDebugInfo('Listo para reproducir');
                        }}
                    >
                        <source src={src} type="video/mp4" />
                        Tu navegador no soporta videos HTML5.
                    </video>

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                                <p className="text-gray-400 text-sm">Cargando video...</p>
                                <p className="text-gray-500 text-xs mt-1">{debugInfo}</p>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                // Placeholder cuando el video no está disponible
                <div className={`h-64 bg-gray-800 rounded-lg flex items-center justify-center ${className}`}>
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-400 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-gray-400 text-sm">Video no disponible</p>
                        <p className="text-gray-500 text-xs mt-1">Ruta: {src}</p>
                        <p className="text-gray-500 text-xs">{debugInfo}</p>
                        <button
                            onClick={() => {
                                console.log('REINTENTANDO cargar video:', src);
                                setVideoError(false);
                                setIsLoading(true);
                                setDebugInfo('Reintentando...');
                            }}
                            className="mt-3 px-3 py-1 bg-green-400 text-black text-xs rounded hover:bg-green-300 transition-colors"
                        >
                            Reintentar
                        </button>

                        {/* Botón para probar video directamente */}
                        <a
                            href={src}
                            target="_blank"
                            className="block mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-400 transition-colors"
                        >
                            Abrir video directo
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
