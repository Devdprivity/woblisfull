import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import MobileNav from '@/components/mobile-nav';
import { AppShell } from '@/components/app-shell';

interface AppLayoutTemplateProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayoutTemplate({
    children,
}: AppLayoutTemplateProps) {
    return (
        <AppShell variant="sidebar">
            <div className="min-h-screen bg-black">
                <AppHeader />
                <AppSidebar />
                <main className="flex-1 pb-16 md:pb-0">
                    {children}
                </main>
                <MobileNav />
            </div>
        </AppShell>
    );
}
