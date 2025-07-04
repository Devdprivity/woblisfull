import { type ReactNode } from 'react';
import WoblisHeader from '@/components/woblis-header';
import WoblisMobileHeader from '@/components/woblis-mobile-header';
import WoblisFooter from '@/components/woblis-footer';
import MobileNav from '@/components/mobile-nav';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-black flex flex-col">
            <WoblisHeader />
            <WoblisMobileHeader />
            <main className="flex-grow pb-16 md:pb-0">
                {children}
            </main>
            <MobileNav />
            <div className="hidden md:block">
                <WoblisFooter />
            </div>
        </div>
    );
}
