import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link } from "@inertiajs/react";

interface Question {
    id?: number;
    question: string;
    type: string;
    options: string[];
    required: boolean;
    order: number;
    help_text: string;
}

export default function CampaignsCreate() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
        question: "",
        type: "text",
        options: [],
        required: false,
        order: 1,
        help_text: "",
    });

    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        client_name: "",
        client_email: "",
        client_phone: "",
        max_responses: "",
        start_date: "",
        end_date: "",
        questions: [] as Question[],
    });

    const questionTypes = [
        { value: "text", label: "Texto corto" },
        { value: "textarea", label: "Texto largo" },
        { value: "radio", label: "Opción única" },
        { value: "checkbox", label: "Múltiple selección" },
        { value: "select", label: "Lista desplegable" },
        { value: "number", label: "Número" },
        { value: "email", label: "Email" },
        { value: "phone", label: "Teléfono" },
    ];

    const addQuestion = () => {
        if (!currentQuestion.question || !currentQuestion.question.trim()) {
            return;
        }

        const newQuestion = {
            ...currentQuestion,
            order: questions.length + 1,
        };

        const updatedQuestions = [...questions, newQuestion];
        setQuestions(updatedQuestions);
        setData("questions", updatedQuestions);

        setCurrentQuestion({
            question: "",
            type: "text",
            options: [],
            required: false,
            order: questions.length + 2,
            help_text: "",
        });
    };

    const removeQuestion = (index: number) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        const reorderedQuestions = updatedQuestions.map((q, i) => ({
            ...q,
            order: i + 1,
        }));
        setQuestions(reorderedQuestions);
        setData("questions", reorderedQuestions);
    };

    const addOption = () => {
        setCurrentQuestion({
            ...currentQuestion,
            options: [...currentQuestion.options, ""],
        });
    };

    const updateOption = (index: number, value: string) => {
        const updatedOptions = [...currentQuestion.options];
        updatedOptions[index] = value;
        setCurrentQuestion({
            ...currentQuestion,
            options: updatedOptions,
        });
    };

    const removeOption = (index: number) => {
        setCurrentQuestion({
            ...currentQuestion,
            options: currentQuestion.options.filter((_, i) => i !== index),
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (questions.length === 0) {
            alert("Debes agregar al menos una pregunta");
            return;
        }

        post("/admin/campaigns");
    };

    const needsOptions = ["radio", "checkbox", "select"].includes(currentQuestion.type);

    return (
        <AppLayout>
            <Head title="Crear Campaña" />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/campaigns">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Crear Nueva Campaña</h1>
                        <p className="text-white">Configura una nueva campaña de encuestas</p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de la Campaña</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="title">Título de la Campaña</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        error={errors.title}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="client_name">Nombre del Cliente</Label>
                                    <Input
                                        id="client_name"
                                        value={data.client_name}
                                        onChange={(e) => setData("client_name", e.target.value)}
                                        error={errors.client_name}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    error={errors.description}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="client_email">Email del Cliente</Label>
                                    <Input
                                        id="client_email"
                                        type="email"
                                        value={data.client_email}
                                        onChange={(e) => setData("client_email", e.target.value)}
                                        error={errors.client_email}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="client_phone">Teléfono del Cliente (Opcional)</Label>
                                    <Input
                                        id="client_phone"
                                        value={data.client_phone}
                                        onChange={(e) => setData("client_phone", e.target.value)}
                                        error={errors.client_phone}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="max_responses">Máximo de Respuestas (Opcional)</Label>
                                    <Input
                                        id="max_responses"
                                        type="number"
                                        value={data.max_responses}
                                        onChange={(e) => setData("max_responses", e.target.value)}
                                        error={errors.max_responses}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="start_date">Fecha de Inicio (Opcional)</Label>
                                    <Input
                                        id="start_date"
                                        type="datetime-local"
                                        value={data.start_date}
                                        onChange={(e) => setData("start_date", e.target.value)}
                                        error={errors.start_date}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="end_date">Fecha de Fin (Opcional)</Label>
                                    <Input
                                        id="end_date"
                                        type="datetime-local"
                                        value={data.end_date}
                                        onChange={(e) => setData("end_date", e.target.value)}
                                        error={errors.end_date}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Preguntas de la Encuesta ({questions.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {questions.map((question, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-medium">{question.order}. {question.question}</h4>
                                            <p className="text-sm text-gray-600">
                                                Tipo: {questionTypes.find(t => t.value === question.type)?.label}
                                                {question.required && " • Obligatoria"}
                                            </p>
                                            {question.options.length > 0 && (
                                                <div className="mt-2">
                                                    <span className="text-xs text-gray-500">Opciones: </span>
                                                    {question.options.join(", ")}
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeQuestion(index)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                <h4 className="font-medium mb-4">Agregar Nueva Pregunta</h4>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="question">Pregunta</Label>
                                        <Input
                                            id="question"
                                            value={currentQuestion.question}
                                            onChange={(e) => setCurrentQuestion({
                                                ...currentQuestion,
                                                question: e.target.value
                                            })}
                                            placeholder="Escribe tu pregunta aquí..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="type">Tipo de Pregunta</Label>
                                            <Select
                                                value={currentQuestion.type}
                                                onValueChange={(value) => setCurrentQuestion({
                                                    ...currentQuestion,
                                                    type: value,
                                                    options: []
                                                })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {questionTypes.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center space-x-2 pt-6">
                                            <input
                                                type="checkbox"
                                                id="required"
                                                checked={currentQuestion.required}
                                                onChange={(e) => setCurrentQuestion({
                                                    ...currentQuestion,
                                                    required: e.target.checked
                                                })}
                                            />
                                            <Label htmlFor="required">Pregunta obligatoria</Label>
                                        </div>
                                    </div>

                                    {needsOptions && (
                                        <div>
                                            <Label>Opciones</Label>
                                            <div className="space-y-2">
                                                {currentQuestion.options.map((option, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <Input
                                                            value={option}
                                                            onChange={(e) => updateOption(index, e.target.value)}
                                                            placeholder={`Opción ${index + 1}`}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => removeOption(index)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={addOption}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Agregar Opción
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="help_text">Texto de Ayuda (Opcional)</Label>
                                        <Input
                                            id="help_text"
                                            value={currentQuestion.help_text}
                                            onChange={(e) => setCurrentQuestion({
                                                ...currentQuestion,
                                                help_text: e.target.value
                                            })}
                                            placeholder="Proporciona información adicional sobre la pregunta..."
                                        />
                                    </div>

                                    <Button type="button" onClick={addQuestion}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Agregar Pregunta
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Link href="/admin/campaigns">
                            <Button variant="outline">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Creando..." : "Crear Campaña"}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
