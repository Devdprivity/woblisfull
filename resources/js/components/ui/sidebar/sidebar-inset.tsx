import { type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export function SidebarInset({
    className,
    ...props
}: ComponentPropsWithoutRef<'main'>) {
    return (
        <main
            data-slot="sidebar-inset"
            className={cn('flex flex-1 flex-col', className)}
            {...props}
        />
    );
}
