import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Separator } from '@/components/ui/separator';
import { NavGroup } from '@/types';
import { LayoutDashboard, Users, Shield, CreditCard, Building2, FileText, MessageCircle, Heart, ClipboardList } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader
} from '@/components/ui/sidebar';

const adminNavItems: NavGroup[] = [
    {
        title: 'ADMINISTRACIÓN',
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutDashboard,
                label: 'Dashboard',
                type: 'item',
            },
            {
                title: 'Empresas',
                href: '/admin/companies',
                icon: Building2,
                label: 'Empresas',
                type: 'item',
            },
        ],
    },
    {
        title: 'CONTENIDO',
        items: [
            {
                title: 'Posts',
                href: '/admin/posts',
                icon: FileText,
                label: 'Posts',
                type: 'item',
            },
        ],
    },
    {
        title: 'INTERACCIÓN',
        items: [
            {
                title: 'Likes',
                href: '/admin/likes',
                icon: Heart,
                label: 'Likes',
                type: 'item',
            },
            {
                title: 'Comentarios',
                href: '/admin/comments',
                icon: MessageCircle,
                label: 'Comentarios',
                type: 'item',
            },
        ],
    },
    {
        title: 'ENCUESTAS',
        items: [
            {
                title: 'Campañas',
                href: '/admin/campaigns',
                icon: ClipboardList,
                label: 'Campañas',
                type: 'item',
            },
        ],
    },
];

const footerMainNavItems: NavGroup[] = [
    {
        title: 'GESTIÓN DEL SISTEMA',
        items: [
            {
                title: 'Gestión de Usuarios',
                href: '/admin/users',
                icon: Users,
                label: 'Gestión de Usuarios',
                type: 'item',
            },
            {
                title: 'Roles y Permisos',
                href: '/admin/roles',
                icon: Shield,
                label: 'Roles y Permisos',
                type: 'item',
            },
            {
                title: 'Gestión de Planes',
                href: '/admin/plans',
                icon: CreditCard,
                label: 'Gestión de Planes',
                type: 'item',
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">W</span>
                    </div>
                    <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
                        Woblis
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <nav className="px-2 space-y-2">
                    {adminNavItems.map((section) => (
                        <div key={section.title} className="space-y-2">
                            <h4 className="px-2 text-xs font-semibold tracking-wide text-muted-foreground group-data-[collapsible=icon]:hidden">
                                {section.title}
                            </h4>
                            <NavMain items={section.items} />
                        </div>
                    ))}
                </nav>
            </SidebarContent>
            <SidebarFooter className="p-4 space-y-4">
                {/* Footer Main - Gestión del Sistema */}
                <div className="space-y-2">
                    {footerMainNavItems.map((section) => (
                        <div key={section.title} className="space-y-2">
                            <Separator className="my-2" />
                            <h4 className="px-2 text-xs font-semibold tracking-wide text-muted-foreground group-data-[collapsible=icon]:hidden">
                                {section.title}
                            </h4>
                            <NavMain items={section.items} />
                        </div>
                    ))}
                </div>

                {/* Separador antes del perfil */}
                <Separator className="my-2" />

                {/* Dropdown de perfil */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
