import { Head } from '@inertiajs/react';
import WoblisHero from '@/components/woblis-hero';
import WoblisAbout from '@/components/woblis-about';
import WoblisFeatures from '@/components/woblis-features';
import WoblisHowItWorks from '@/components/woblis-how-it-works';
import WoblisTestimonials from '@/components/woblis-testimonials';
import WoblisPricing from '@/components/woblis-pricing';
import WoblisContact from '@/components/woblis-contact';
import PublicLayout from '@/layouts/public-layout';

export default function Welcome() {
    return (
        <PublicLayout>
            <Head title="Zenit - Encuestas para conductores" />
            <main>
                        <WoblisHero />
                        <WoblisAbout />
                        <WoblisFeatures />
                <WoblisHowItWorks />
                        <WoblisTestimonials />
                        <WoblisPricing />
                        <WoblisContact />
                </main>
        </PublicLayout>
    );
}
