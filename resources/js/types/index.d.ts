import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href?: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    type?: 'header' | 'item';
    target?: '_self' | '_blank' | '_parent' | '_top';
    label: string;
}

export interface Role {
    id: number;
    name: string;
    display_name: string;
    description: string;
    permissions: string[];
    created_at: string;
    updated_at: string;
}

export interface Plan {
    id: number;
    name: string;
    slug: string;
    category: string;
    price: number;
    description: string;
    responses_included: number;
    delivery_time: string;
    features: string[];
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    google_id?: string;
    provider: string;
    account_type: 'client' | 'company';
    company_name?: string;
    company_rut?: string;
    company_address?: string;
    company_phone?: string;
    plan_id?: number;
    role_id: number;
    status: 'pending' | 'active' | 'suspended';
    activated_at?: string;
    activation_notes?: string;
    created_at: string;
    updated_at: string;
    role?: Role;
    plan?: Plan;
    [key: string]: unknown;
}
