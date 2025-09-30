import WoblisVideo from './woblis-video';

export default function ZenitHero() {
    return (
        <section className="bg-black text-green-400 min-h-[calc(100vh-4rem)] flex items-center py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    {/* Video section */}
                    <div className="w-full md:w-1/2">
                        <div className="relative">
                            <WoblisVideo />
                        </div>
                    </div>

                    {/* Content section */}
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-bold mb-8">
                            <span className="text-[#7fff00]">261,000</span>{" "}
                            <span className="text-white">viajes al día.</span>
                            <br />
                            <span className="text-white">Zenit los convierte</span>
                            <br />
                            <span className="text-white">en</span>{" "}
                            <span className="text-[#7fff00]">Insights</span>
                        </h1>

                        {/* QR Code */}
                        <div className="mt-8 flex justify-center md:justify-start">
                            <div className="w-24 h-24 bg-black rounded-lg flex items-center justify-center">
                                <div className="w-20 h-20 rounded grid grid-cols-8 gap-px p-1">
                                    {/* Simple QR pattern */}
                                    {Array.from({ length: 64 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-full h-full ${Math.random() > 0.5 ? 'bg-[#7fff00]' : 'bg-black'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
