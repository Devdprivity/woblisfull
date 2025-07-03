import WoblisHeader from '@/components/woblis-header';
import WoblisFooter from '@/components/woblis-footer';
import { type ReactNode } from 'react';

interface BlogLayoutProps {
    children: ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
    return (
        <div className="min-h-screen bg-black">
            <WoblisHeader />
            <main className="relative">
                {children}
            </main>
            <WoblisFooter />
        </div>
    );
}
