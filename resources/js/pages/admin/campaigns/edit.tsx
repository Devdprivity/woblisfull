import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  GripVertical,
  Settings
} from 'lucide-react';
import { useState } from 'react';

interface Question {
  id?: number;
  question: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'number' | 'email' | 'phone';
  options?: string[];
  required: boolean;
  order: number;
  help_text?: string;
  validation_rules?: string[];
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
  max_responses?: number;
  start_date?: string;
  end_date?: string;
  settings?: {
    allow_anonymous?: boolean;
    require_location?: boolean;
    send_notifications?: boolean;
  };
  questions: Question[];
}

interface Props {
  campaign: Campaign;
}

const questionTypes = [
  { value: 'text', label: 'Texto corto' },
  { value: 'textarea', label: 'Texto largo' },
  { value: 'radio', label: 'Opción única' },
  { value: 'checkbox', label: 'Múltiple selección' },
  { value: 'select', label: 'Lista desplegable' },
  { value: 'number', label: 'Número' },
  { value: 'email', label: 'Correo electrónico' },
  { value: 'phone', label: 'Teléfono' },
];

const statusOptions = [
  { value: 'draft', label: 'Borrador' },
  { value: 'active', label: 'Activa' },
  { value: 'paused', label: 'Pausada' },
  { value: 'completed', label: 'Completada' },
];

export default function Edit({ campaign }: Props) {
  const [questions, setQuestions] = useState<Question[]>(
    campaign.questions?.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options || []
    })) || []
  );

  const { data, setData, put, processing, errors } = useForm({
    title: campaign.title || '',
    description: campaign.description || '',
    client_name: campaign.client_name || '',
    client_email: campaign.client_email || '',
    client_phone: campaign.client_phone || '',
    status: campaign.status || 'draft',
    max_responses: campaign.max_responses || '',
    start_date: campaign.start_date ? campaign.start_date.split('T')[0] : '',
    end_date: campaign.end_date ? campaign.end_date.split('T')[0] : '',
    allow_anonymous: campaign.settings?.allow_anonymous || false,
    require_location: campaign.settings?.require_location || false,
    send_notifications: campaign.settings?.send_notifications || false,
    questions: questions,
  });

  const addQuestion = () => {
    const newQuestion: Question = {
      question: '',
      type: 'text',
      required: true,
      order: questions.length + 1,
      options: [],
    };

    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    setData('questions', updatedQuestions);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
    setData('questions', updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    // Reordenar
    updatedQuestions.forEach((q, i) => q.order = i + 1);
    setQuestions(updatedQuestions);
    setData('questions', updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const options = updatedQuestions[questionIndex].options || [];
    updatedQuestions[questionIndex].options = [...options, ''];
    setQuestions(updatedQuestions);
    setData('questions', updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    const options = [...(updatedQuestions[questionIndex].options || [])];
    options[optionIndex] = value;
    updatedQuestions[questionIndex].options = options;
    setQuestions(updatedQuestions);
    setData('questions', updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    const options = updatedQuestions[questionIndex].options?.filter((_, i) => i !== optionIndex) || [];
    updatedQuestions[questionIndex].options = options;
    setQuestions(updatedQuestions);
    setData('questions', updatedQuestions);
  };

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    const updatedQuestions = [...questions];
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedQuestion);

    // Reordenar
    updatedQuestions.forEach((q, i) => q.order = i + 1);
    setQuestions(updatedQuestions);
    setData('questions', updatedQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/campaigns/${campaign.id}`);
  };

  const needsOptions = (type: string) => ['radio', 'checkbox', 'select'].includes(type);

  return (
    <AppLayout>
      <Head title={`Editar Campaña: ${campaign.title}`} />

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
              <h1 className="text-2xl font-bold">Editar Campaña</h1>
              <p className="text-muted-foreground">
                Modifica los detalles y preguntas de la campaña
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
              {statusOptions.find(s => s.value === campaign.status)?.label}
            </Badge>
            <Link href={`/admin/campaigns/${campaign.id}`}>
              <Button variant="outline" size="sm">
                Ver Detalles
              </Button>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título de la Campaña *</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <Label htmlFor="status">Estado</Label>
                  <select
                    id="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información del cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="client_name">Nombre del Cliente *</Label>
                  <Input
                    id="client_name"
                    value={data.client_name}
                    onChange={(e) => setData('client_name', e.target.value)}
                    className={errors.client_name ? 'border-red-500' : ''}
                  />
                  {errors.client_name && <p className="text-sm text-red-500 mt-1">{errors.client_name}</p>}
                </div>

                <div>
                  <Label htmlFor="client_email">Email del Cliente *</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={data.client_email}
                    onChange={(e) => setData('client_email', e.target.value)}
                    className={errors.client_email ? 'border-red-500' : ''}
                  />
                  {errors.client_email && <p className="text-sm text-red-500 mt-1">{errors.client_email}</p>}
                </div>

                <div>
                  <Label htmlFor="client_phone">Teléfono del Cliente</Label>
                  <Input
                    id="client_phone"
                    value={data.client_phone}
                    onChange={(e) => setData('client_phone', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Configuración de la Campaña
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="max_responses">Límite de Respuestas</Label>
                  <Input
                    id="max_responses"
                    type="number"
                    value={data.max_responses}
                    onChange={(e) => setData('max_responses', e.target.value)}
                    placeholder="Sin límite"
                  />
                </div>

                <div>
                  <Label htmlFor="start_date">Fecha de Inicio</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={data.start_date}
                    onChange={(e) => setData('start_date', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="end_date">Fecha de Fin</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={data.end_date}
                    onChange={(e) => setData('end_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allow_anonymous"
                    checked={data.allow_anonymous}
                    onCheckedChange={(checked) => setData('allow_anonymous', Boolean(checked))}
                  />
                  <Label htmlFor="allow_anonymous">Permitir respuestas anónimas</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="require_location"
                    checked={data.require_location}
                    onCheckedChange={(checked) => setData('require_location', Boolean(checked))}
                  />
                  <Label htmlFor="require_location">Requerir geolocalización</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="send_notifications"
                    checked={data.send_notifications}
                    onCheckedChange={(checked) => setData('send_notifications', Boolean(checked))}
                  />
                  <Label htmlFor="send_notifications">Enviar notificaciones por email</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preguntas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Preguntas de la Encuesta ({questions.length})</CardTitle>
                <Button type="button" onClick={addQuestion} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Pregunta
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No hay preguntas configuradas</p>
                  <Button type="button" onClick={addQuestion} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Primera Pregunta
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Pregunta #{index + 1}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label>Pregunta *</Label>
                          <Input
                            value={question.question}
                            onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                            placeholder="Escribe tu pregunta aquí..."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Tipo de Pregunta</Label>
                            <select
                              value={question.type}
                              onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                              className="w-full px-3 py-2 border rounded-md"
                            >
                              {questionTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <Label>Texto de Ayuda</Label>
                            <Input
                              value={question.help_text || ''}
                              onChange={(e) => updateQuestion(index, 'help_text', e.target.value)}
                              placeholder="Texto explicativo opcional"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={question.required}
                            onCheckedChange={(checked) => updateQuestion(index, 'required', Boolean(checked))}
                          />
                          <Label>Campo obligatorio</Label>
                        </div>

                        {needsOptions(question.type) && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label>Opciones</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(index)}
                              >
                                <Plus className="mr-1 h-3 w-3" />
                                Agregar
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {(question.options || []).map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                    placeholder={`Opción ${optionIndex + 1}`}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeOption(index, optionIndex)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex items-center justify-end space-x-4">
            <Link href="/admin/campaigns">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={processing}>
              <Save className="mr-2 h-4 w-4" />
              {processing ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
