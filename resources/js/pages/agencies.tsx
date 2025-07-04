import { Head } from '@inertiajs/react';
import WoblisAgencies from '@/components/woblis-agencies';
import PublicLayout from '@/layouts/public-layout';

export default function Agencies() {
    return (
        <PublicLayout>
            <Head title="Agencias - Woblis" />
            <WoblisAgencies />
        </PublicLayout>
    );
}
