import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Icon } from '@/components/icon';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { url } = usePage().props;

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.href || item.title}>
                        {item.type === 'header' ? (
                            <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                {item.title}
                            </div>
                        ) : (
                            <SidebarMenuButton
                                asChild
                                isActive={url === item.href}
                                tooltip={{ children: item.label }}
                                className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
                            >
                                {item.href?.startsWith('http') ? (
                                    <a
                                        href={item.href}
                                        target={item.target || '_blank'}
                                        rel="noopener noreferrer"
                                    >
                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                        <span>{item.label}</span>
                                    </a>
                                ) : (
                                    <Link href={item.href || '#'}>
                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                        <span>{item.label}</span>
                                    </Link>
                                )}
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
