import { type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export function SidebarContent({
    className,
    ...props
}: ComponentPropsWithoutRef<'div'>) {
    return (
        <div
            data-slot="sidebar-content"
            className={cn('flex-1 overflow-y-auto', className)}
            {...props}
        />
    );
}
