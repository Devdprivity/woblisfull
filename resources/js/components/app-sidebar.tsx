import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Building2, LayoutGrid, Users, UserCog, CreditCard, FileText, MessageCircle, Heart, ClipboardList } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Acceso y Autenticación',
        type: 'header'
    },
    {
        title: 'Gestión de Usuarios',
        href: '/admin/users',
        icon: Users,
        target: '_self'
    },
    {
        title: 'Roles y Permisos',
        href: '/admin/roles',
        icon: UserCog,
        target: '_self'
    },
    {
        title: 'Gestión de Planes',
        href: '/admin/plans',
        icon: CreditCard,
        target: '_self'
    }
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // Define navigation items based on user role
    const getMainNavItems = (): NavItem[] => {
        const items: NavItem[] = [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
        ];

        // Add admin navigation items organized by sections
        if (user && user.role?.name === 'admin') {
            items.push(
                {
                    title: 'Gestión de Empresas',
                    type: 'header'
                },
                {
                    title: 'Empresas',
                    href: '/admin/companies',
                    icon: Building2,
                },
                {
                    title: 'Gestión de Contenido',
                    type: 'header'
                },
                {
                    title: 'Posts',
                    href: '/admin/posts',
                    icon: FileText,
                },
                {
                    title: 'Comentarios',
                    href: '/admin/comments',
                    icon: MessageCircle,
                },
                {
                    title: 'Likes',
                    href: '/admin/likes',
                    icon: Heart,
                },
                {
                    title: 'Encuestas',
                    type: 'header'
                },
                {
                    title: 'Campañas',
                    href: '/admin/campaigns',
                    icon: ClipboardList,
                }
            );
        }

        return items;
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <AppLogo />
            </SidebarHeader>
            <SidebarContent>
                <NavUser />
                <NavMain items={getMainNavItems()} />
            </SidebarContent>
            <SidebarFooter>
                <NavFooter items={footerNavItems} />
            </SidebarFooter>
        </Sidebar>
    );
}
