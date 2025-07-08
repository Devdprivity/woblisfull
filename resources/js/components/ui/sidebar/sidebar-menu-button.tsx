import { type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const sidebarMenuButtonVariants = cva(
    'group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                ghost: 'hover:bg-transparent hover:text-sidebar-accent-foreground',
            },
            size: {
                default: 'h-10',
                sm: 'h-8',
                lg: 'h-12',
            },
            isActive: {
                true: 'bg-sidebar-accent text-sidebar-accent-foreground',
                false: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            isActive: false,
        },
    }
);

interface SidebarMenuButtonProps
    extends ComponentPropsWithoutRef<'button'>,
        VariantProps<typeof sidebarMenuButtonVariants> {
    asChild?: boolean;
}

export function SidebarMenuButton({
    className,
    variant,
    size,
    isActive,
    asChild = false,
    ...props
}: SidebarMenuButtonProps) {
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp
            data-slot="sidebar-menu-button"
            className={cn(sidebarMenuButtonVariants({ variant, size, isActive }), className)}
            {...props}
        />
    );
}
