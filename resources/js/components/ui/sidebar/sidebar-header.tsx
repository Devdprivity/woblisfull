import { type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export function SidebarHeader({
    className,
    ...props
}: ComponentPropsWithoutRef<'div'>) {
    return (
        <div
            data-slot="sidebar-header"
            className={cn('flex h-16 shrink-0 items-center border-b border-sidebar-border px-4', className)}
            {...props}
        />
    );
}
