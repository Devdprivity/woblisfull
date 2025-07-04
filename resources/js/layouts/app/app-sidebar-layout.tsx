import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import MobileNav from '@/components/mobile-nav';

interface AppLayoutTemplateProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayoutTemplate({
    children,
}: AppLayoutTemplateProps) {
    return (
        <div className="min-h-screen bg-black">
            <AppHeader />
            <AppSidebar />
            <main className="lg:pl-72 pb-16 md:pb-0">
                {children}
            </main>
            <MobileNav />
        </div>
    );
}
