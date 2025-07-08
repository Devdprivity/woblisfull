import { type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export function SidebarMenuItem({
    className,
    ...props
}: ComponentPropsWithoutRef<'li'>) {
    return (
        <li
            data-slot="sidebar-menu-item"
            className={cn('relative', className)}
            {...props}
        />
    );
}
