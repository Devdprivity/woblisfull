export default function WoblisImageSection() {
    return (
        <section className="bg-black py-16">
            <div className="container mx-auto px-8">
                <div className="relative">
                    <img
                        src="/images/people-in-car.jpg"
                        alt="Personas en un viaje"
                        className="w-full h-96 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                    <div className="absolute bottom-8 left-8 right-8">
                        <h3 className="text-white text-2xl font-bold mb-4">
                            Experiencias reales, datos auténticos
                        </h3>
                        <p className="text-white text-lg">
                            Cada viaje cuenta una historia única que nos ayuda a entender mejor
                            las necesidades de movilidad de las personas.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
