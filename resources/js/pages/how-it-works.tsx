import { Head } from '@inertiajs/react';
import WoblisHowItWorks from '@/components/woblis-how-it-works';
import PublicLayout from '@/layouts/public-layout';

export default function HowItWorks() {
    return (
        <PublicLayout>
            <Head title="¿Cómo funciona? - Zenit" />
            <WoblisHowItWorks />
        </PublicLayout>
    );
}
