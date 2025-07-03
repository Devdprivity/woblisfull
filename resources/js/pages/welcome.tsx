import { Head } from '@inertiajs/react';
import WoblisHeader from '@/components/woblis-header';
import WoblisHero from '@/components/woblis-hero';
import WoblisAbout from '@/components/woblis-about';
import WoblisFeatures from '@/components/woblis-features';

import WoblisTestimonials from '@/components/woblis-testimonials';
import WoblisPricing from '@/components/woblis-pricing';
import WoblisContact from '@/components/woblis-contact';
import WoblisFooter from '@/components/woblis-footer';

export default function Welcome() {
    return (
        <>
            <Head title="Woblis - Escala, Optimiza, Impacta">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
                <meta name="description" content="261,000 viajes al día. Woblis los convierte en Insights. Plataforma integral de insights de movilidad para empresas, gobiernos y organizaciones." />
            </Head>

            <div className="min-h-screen bg-black">
                <WoblisHeader />

                <main className="pt-20"> {/* Add padding-top to account for fixed header */}
                    <section id="inicio">
                        <WoblisHero />
                    </section>

                    <section id="acerca">
                        <WoblisAbout />
                    </section>

                    <section id="soluciones">
                        <WoblisFeatures />
                    </section>



                    <section id="testimonios">
                        <WoblisTestimonials />
                    </section>

                    <section id="precios">
                        <WoblisPricing />
                    </section>

                    <section id="contacto">
                        <WoblisContact />
                    </section>
                </main>

                <WoblisFooter />
            </div>
        </>
    );
}
