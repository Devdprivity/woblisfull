import { Head } from '@inertiajs/react';
import WoblisDrivers from '@/components/woblis-drivers';
import PublicLayout from '@/layouts/public-layout';

export default function Drivers() {
    return (
        <PublicLayout>
            <Head title="¿Quieres ser Woblis? - Woblis" />
            <WoblisDrivers />
        </PublicLayout>
    );
}
