import { type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export function SidebarFooter({
    className,
    ...props
}: ComponentPropsWithoutRef<'div'>) {
    return (
        <div
            data-slot="sidebar-footer"
            className={cn('mt-auto', className)}
            {...props}
        />
    );
}
