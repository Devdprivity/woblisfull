import { Head } from '@inertiajs/react';
import WoblisHeader from '@/components/woblis-header';
import WoblisFooter from '@/components/woblis-footer';
import WoblisHowItWorks from '@/components/woblis-how-it-works';

export default function HowItWorks() {
    return (
        <>
            <Head title="¿Cómo funciona? - Woblis" />

            <div className="min-h-screen bg-black">
                <WoblisHeader />

                {/* Main Content */}
                <main className="pt-20">
                    <WoblisHowItWorks />
                </main>

                <WoblisFooter />
            </div>
        </>
    );
}
