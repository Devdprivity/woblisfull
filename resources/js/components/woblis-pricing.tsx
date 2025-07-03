import { useState, useEffect } from 'react';

interface Plan {
    id: number;
    name: string;
    slug: string;
    category: string;
    categoryName: string;
    price: string;
    rawPrice: number;
    description: string;
    responsesIncluded: number;
    deliveryTime: string;
    features: string[];
    sortOrder: number;
}

export default function WoblisPricing() {
    const [showModal, setShowModal] = useState(false);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch('/api/plans');
                if (!response.ok) {
                    throw new Error('Error al cargar los planes');
                }
                const data = await response.json();
                setPlans(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
                console.error('Error fetching plans:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    // Categorías y descripciones
    const categoryDescriptions = {
        'pyme': "Para quienes lideran con esfuerzo diario, sin grandes presupuestos ni tiempo que perder, pero con la convicción de que mejorar comienza con escuchar. Woblis entrega datos reales, ágiles y accionables para tomar decisiones con fundamento.",
        'corp': "Para equipos que entienden que la intuición no reemplaza la evidencia. Toma decisiones respaldadas por datos recientes, recolectados en terreno y validados. Porque en escenarios cambiantes, la frescura del dato es ventaja competitiva."
    };

    // Agrupar planes por categoría y mostrar primeros 3
    const pymeShown = plans.filter(p => p.category === 'pyme').slice(0, 2);
    const corpShown = plans.filter(p => p.category === 'corp').slice(0, 1);
    const visiblePlans = [...pymeShown, ...corpShown];

    // Planes para el modal (los restantes)
    const pymeModal = plans.filter(p => p.category === 'pyme').slice(2);
    const corpModal = plans.filter(p => p.category === 'corp').slice(1);
    const modalPlans = [...pymeModal, ...corpModal];

    if (loading) {
        return (
            <section className="bg-black text-white py-16">
                <div className="container mx-auto px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7fff00] mx-auto"></div>
                        <p className="mt-4 text-gray-400">Cargando planes...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-black text-white py-16">
                <div className="container mx-auto px-8">
                    <div className="text-center">
                        <p className="text-red-400">Error: {error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-[#7fff00] text-black px-6 py-2 rounded hover:bg-green-300 transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="bg-black text-white py-16">
                <div className="container mx-auto px-8">
                    <h2 className="text-[#7fff00] text-4xl font-bold text-center mb-4">
                        Datos reales. Gente real. Decisiones que valen.
                    </h2>

                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
                        {visiblePlans.map((plan, index) => {
                            const isFirstOfCategory = index === 0 || visiblePlans[index - 1]?.category !== plan.category;
                            const categoryDescription = categoryDescriptions[plan.category as keyof typeof categoryDescriptions];

                            return (
                                <div key={plan.id} className="border border-green-400 rounded-lg p-6 hover:bg-green-900 hover:bg-opacity-10 transition-colors">
                                    {isFirstOfCategory && categoryDescription && (
                                        <div className="mb-4 pb-4 border-b border-gray-700">
                                            <h3 className="text-[#7fff00] text-lg font-bold mb-2">
                                                {plan.categoryName}
                                            </h3>
                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                {categoryDescription}
                                            </p>
                                        </div>
                                    )}

                                    <h4 className="text-white text-xl font-bold mb-2">
                                        {plan.name}
                                    </h4>

                                    <div className="text-2xl font-bold text-[#7fff00] mb-4">
                                        {plan.price}
                                    </div>

                                    <p className="text-sm text-gray-300 mb-4 font-medium">
                                        {plan.description}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="text-sm flex items-start">
                                                <span className="text-[#7fff00] mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button className="w-full bg-green-400 text-black py-2 px-4 rounded font-semibold hover:bg-green-300 transition-colors">
                                        Seleccionar Plan
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center mt-12">
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-transparent border-2 border-green-400 text-[#7fff00] px-8 py-3 rounded-lg font-semibold hover:bg-green-400 hover:text-black transition-colors"
                        >
                            Mostrar Más Planes
                        </button>
                    </div>
                </div>
            </section>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-[#7fff00] text-2xl font-bold">
                                Planes Adicionales
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                                {modalPlans.map((plan) => (
                                    <div key={plan.id} className="border border-green-400 rounded-lg p-6 hover:bg-green-900 hover:bg-opacity-10 transition-colors">
                                        <h4 className="text-white text-xl font-bold mb-2">
                                            {plan.name}
                                        </h4>

                                        <div className="text-2xl font-bold text-[#7fff00] mb-4">
                                            {plan.price}
                                        </div>

                                        <p className="text-sm text-gray-300 mb-4 font-medium">
                                            {plan.description}
                                        </p>

                                        <ul className="space-y-2 mb-6">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="text-sm flex items-start">
                                                    <span className="text-[#7fff00] mr-2">✓</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <button className="w-full bg-green-400 text-black py-2 px-4 rounded font-semibold hover:bg-green-300 transition-colors">
                                            Seleccionar Plan
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
