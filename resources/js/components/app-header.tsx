import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    return (
        <div className="sticky top-0 z-40 lg:pl-72">
            <AppSidebarHeader breadcrumbs={breadcrumbs} />
        </div>
    );
}
