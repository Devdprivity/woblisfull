import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import {
  ArrowLeft,
  Eye,
  QrCode,
  Play,
  CheckCircle,
  XCircle,
  MapPin,
  Users,
  BarChart3,
  FileText,
  Share2,
  Download
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  type: string;
  options?: string[] | string;
  required: boolean;
  order: number;
  help_text?: string;
}

interface Response {
  id: number;
  completed: boolean;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  ip_address?: string;
  started_at: string;
  completed_at?: string;
}

interface Campaign {
  id: number;
  title: string;
  description?: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  slug: string;
  qr_code?: string;
  max_responses?: number;
  start_date?: string;
  end_date?: string;
  total_scans: number;
  total_opens: number;
  total_starts: number;
  total_completes: number;
  total_incompletes: number;
  created_at: string;
  updated_at: string;
  questions: Question[];
  responses: Response[];
}

interface Props {
  campaign: Campaign;
}

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    draft: { variant: 'secondary' as const, label: 'Borrador' },
    active: { variant: 'default' as const, label: 'Activa' },
    paused: { variant: 'destructive' as const, label: 'Pausada' },
    completed: { variant: 'outline' as const, label: 'Completada' },
  };

  const config = variants[status as keyof typeof variants] || variants.draft;

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  description
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </CardContent>
  </Card>
);

export default function Show({ campaign }: Props) {
  const completionRate = campaign.total_starts > 0
    ? Math.round((campaign.total_completes / campaign.total_starts) * 100)
    : 0;

  const openRate = campaign.total_scans > 0
    ? Math.round((campaign.total_opens / campaign.total_scans) * 100)
    : 0;

  const startRate = campaign.total_opens > 0
    ? Math.round((campaign.total_starts / campaign.total_opens) * 100)
    : 0;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No definida';
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const copyQRUrl = () => {
    if (campaign.qr_code) {
      navigator.clipboard.writeText(campaign.qr_code);
      // En una implementación real, mostrarías un toast aquí
    }
  };

  return (
    <AppLayout>
      <Head title={`Campaña: ${campaign.title}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/campaigns">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Campañas
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{campaign.title}</h1>
              <p className="text-muted-foreground">
                Cliente: {campaign.client_name} • {campaign.client_email}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={campaign.status} />
            <Button variant="outline" size="sm" onClick={copyQRUrl}>
              <Share2 className="mr-2 h-4 w-4" />
              Copiar URL
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Descripción y detalles */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Campaña</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaign.description && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h4>
                <p className="text-sm">{campaign.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Fecha de inicio</h4>
                <p className="text-sm">{formatDate(campaign.start_date)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Fecha de fin</h4>
                <p className="text-sm">{formatDate(campaign.end_date)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Máx. respuestas</h4>
                <p className="text-sm">{campaign.max_responses || 'Sin límite'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Teléfono</h4>
                <p className="text-sm">{campaign.client_phone || 'No disponible'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Escaneos QR"
            value={campaign.total_scans}
            icon={QrCode}
            description="Total de escaneos del código QR"
          />
          <StatCard
            title="Páginas Abiertas"
            value={`${campaign.total_opens} (${openRate}%)`}
            icon={Eye}
            description="Personas que abrieron la encuesta"
          />
          <StatCard
            title="Encuestas Iniciadas"
            value={`${campaign.total_starts} (${startRate}%)`}
            icon={Play}
            description="Personas que comenzaron a responder"
          />
          <StatCard
            title="Completadas"
            value={`${campaign.total_completes} (${completionRate}%)`}
            icon={CheckCircle}
            description="Encuestas finalizadas"
          />
          <StatCard
            title="Incompletas"
            value={campaign.total_incompletes}
            icon={XCircle}
            description="Encuestas abandonadas"
          />
        </div>

        {/* Preguntas de la encuesta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Preguntas de la Encuesta ({campaign.questions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaign.questions.map((question) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{question.order}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {question.type}
                        </Badge>
                        {question.required && (
                          <Badge variant="destructive" className="text-xs">
                            Obligatoria
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium mb-1">{question.question}</h4>
                      {question.help_text && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {question.help_text}
                        </p>
                      )}
                      {question.options && (() => {
                        let options: string[] = [];
                        try {
                          options = typeof question.options === 'string'
                            ? JSON.parse(question.options)
                            : question.options;
                        } catch (e) {
                          console.error('Error parsing options:', e);
                          return null;
                        }

                        return options.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">Opciones:</p>
                            <ul className="text-sm space-y-1">
                              {options.map((option, optIndex) => (
                                <li key={optIndex} className="flex items-center">
                                  <span className="w-2 h-2 bg-muted rounded-full mr-2"></span>
                                  {option}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Respuestas recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Respuestas Recientes ({campaign.responses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {campaign.responses.length > 0 ? (
              <div className="space-y-3">
                {campaign.responses.slice(0, 10).map((response) => (
                  <div key={response.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {response.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm font-medium">
                          {response.completed ? 'Completada' : 'Incompleta'}
                        </span>
                      </div>
                      {response.city && (
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{response.city}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(response.started_at).toLocaleString('es-CL')}
                    </div>
                  </div>
                ))}
                {campaign.responses.length > 10 && (
                  <div className="text-center">
                    <Button variant="outline" size="sm">
                      Ver todas las respuestas ({campaign.responses.length})
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay respuestas aún</h3>
                <p className="text-sm text-muted-foreground">
                  Las respuestas aparecerán aquí cuando las personas completen la encuesta.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* QR Code y compartir */}
        {campaign.status === 'active' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="mr-2 h-5 w-5" />
                Compartir Encuesta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">URL de la encuesta</h4>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 px-3 py-2 bg-muted rounded text-sm">
                    {campaign.qr_code}
                  </code>
                  <Button variant="outline" size="sm" onClick={copyQRUrl}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <Button variant="outline" className="h-auto py-4" onClick={copyQRUrl}>
                  <div className="text-center">
                    <Share2 className="mx-auto h-5 w-5 mb-2" />
                    <div className="text-sm font-medium">Copiar URL</div>
                    <div className="text-xs text-muted-foreground">
                      Para compartir por mensaje
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto py-4">
                  <div className="text-center">
                    <Download className="mx-auto h-5 w-5 mb-2" />
                    <div className="text-sm font-medium">Descargar QR</div>
                    <div className="text-xs text-muted-foreground">
                      Imagen para imprimir
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
