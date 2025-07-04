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
            <div className="flex min-h-screen overflow-hidden">
                <AppSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <AppHeader />
                    <main className="flex-1 w-full lg:ml-72 overflow-x-hidden">
                        <div className="container mx-auto px-4 py-8">
                            {children}
                        </div>
                    </main>
                    <MobileNav />
                </div>
            </div>
        </AppShell>
    );
}
