import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { type ComponentPropsWithoutRef } from 'react';

export function SidebarTrigger({
    className,
    onClick,
    ...props
}: ComponentPropsWithoutRef<typeof Button>) {
    const { toggleSidebar } = useSidebar();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={(event) => {
                toggleSidebar();
                onClick?.(event);
            }}
            className={cn('h-8 w-8', className)}
            {...props}
        >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
        </Button>
    );
}
