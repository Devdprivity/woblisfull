import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Trash2, Plus, Search, QrCode, ClipboardList, Users, Activity, CheckCircle } from "lucide-react";
import QRModal from "@/components/qr-modal";

interface Campaign {
    id: number;
    title: string;
    description: string;
    client_name: string;
    client_email: string;
    status: string;
    slug: string;
    total_scans: number;
    total_opens: number;
    total_starts: number;
    total_completes: number;
    total_incompletes: number;
    completion_rate: number;
    questions_count: number;
    created_at: string;
    updated_at: string;
}

interface PaginatedCampaigns {
    data: Campaign[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Stats {
    total: number;
    active: number;
    draft: number;
    completed: number;
    total_responses: number;
    total_completes: number;
}

interface Props {
    campaigns: PaginatedCampaigns;
    stats: Stats;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function CampaignsIndex({ campaigns, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "all");

    const handleSearch = () => {
        router.get("/admin/campaigns", {
            search: search || undefined,
            status: status !== "all" ? status : undefined,
        });
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            draft: "bg-gray-100 text-gray-800",
            active: "bg-green-100 text-green-800",
            paused: "bg-yellow-100 text-yellow-800",
            completed: "bg-blue-100 text-blue-800",
        };
        const labels = {
            draft: "Borrador",
            active: "Activa",
            paused: "Pausada",
            completed: "Completada",
        };
        return (
            <Badge className={variants[status as keyof typeof variants]}>
                {labels[status as keyof typeof labels]}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="Gestión de Campañas" />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Gestión de Campañas</h1>
                        <p className="text-white">Administra todas las campañas de encuestas</p>
                    </div>
                    <Link href="/admin/campaigns/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Campaña
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Campañas</CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.active} activas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Respuestas</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_responses}</div>
                            <p className="text-xs text-muted-foreground">
                                Todas las campañas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_completes}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.total_responses > 0 ? ((stats.total_completes / stats.total_responses) * 100).toFixed(1) : 0}% completadas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">En Actividad</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active}</div>
                            <p className="text-xs text-muted-foreground">
                                Campañas activas
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filtros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <Input
                                placeholder="Buscar campañas..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="draft">Borradores</SelectItem>
                                    <SelectItem value="active">Activas</SelectItem>
                                    <SelectItem value="paused">Pausadas</SelectItem>
                                    <SelectItem value="completed">Completadas</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleSearch}>
                                <Search className="w-4 h-4 mr-2" />
                                Buscar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Campañas ({campaigns.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {campaigns.data.map((campaign) => (
                                <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-lg">{campaign.title}</h3>
                                                {getStatusBadge(campaign.status)}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2">{campaign.description}</p>
                                            <div className="text-xs text-gray-500">
                                                Cliente: {campaign.client_name} • Creada: {new Date(campaign.created_at).toLocaleDateString("es-ES")}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/admin/campaigns/${campaign.slug}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/campaigns/${campaign.slug}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                                                        <QRModal campaignSlug={campaign.slug} campaignTitle={campaign.title}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                >
                                    <QrCode className="w-4 h-4" />
                                </Button>
                            </QRModal>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm("¿Estás seguro de eliminar esta campaña?")) {
                                                        router.delete(`/admin/campaigns/${campaign.slug}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <QrCode className="w-4 h-4" />
                                            {campaign.total_scans} escaneos
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {campaign.total_opens} aperturas
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {campaign.total_starts} iniciadas
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4" />
                                            {campaign.total_completes} completadas
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">{campaign.completion_rate}% tasa de completado</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {campaigns.data.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No se encontraron campañas.</p>
                                </div>
                            )}
                        </div>

                        {campaigns.last_page > 1 && (
                            <div className="flex justify-center mt-6 gap-2">
                                {campaigns.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
