import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import MobileNav from '@/components/mobile-nav';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

interface AppLayoutTemplateProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayoutTemplate({
    children,
    breadcrumbs,
}: AppLayoutTemplateProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AppHeader breadcrumbs={breadcrumbs} />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </div>
                <MobileNav />
            </SidebarInset>
        </SidebarProvider>
    );
}
