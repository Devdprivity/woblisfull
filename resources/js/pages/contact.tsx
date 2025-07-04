import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import WoblisContact from '@/components/woblis-contact';

export default function Contact() {
    return (
        <PublicLayout>
            <Head>
                <title>Contacto - Woblis</title>
                <meta name="description" content="Contáctanos para más información sobre Woblis" />
            </Head>

            <div className="min-h-screen bg-black text-white pt-20 pb-24">
                <WoblisContact />
            </div>
        </PublicLayout>
    );
}
