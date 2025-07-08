import { type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps extends ComponentPropsWithoutRef<'div'> {
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
    side?: 'left' | 'right';
}

export function Sidebar({
    variant = 'sidebar',
    collapsible = 'offcanvas',
    side = 'left',
    className,
    children,
    ...props
}: SidebarProps) {
    return (
        <div
            data-slot="sidebar"
            data-variant={variant}
            data-collapsible={collapsible}
            data-side={side}
            className={cn(
                'bg-sidebar text-sidebar-foreground flex h-full w-64 flex-col',
                'border-r border-sidebar-border',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
