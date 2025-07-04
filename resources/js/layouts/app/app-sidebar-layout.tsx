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
            <div className="flex min-h-screen bg-black">
                <AppSidebar />
                <div className="flex-1 w-full">
                    <AppHeader />
                    <main className="w-full lg:ml-72">
                        {children}
                    </main>
                    <MobileNav />
                </div>
            </div>
        </AppShell>
    );
}
