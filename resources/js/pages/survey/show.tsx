import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, MapPin, Clock, User } from "lucide-react";

interface Question {
    id: number;
    question: string;
    type: string;
    options?: string[];
    required: boolean;
    order: number;
}

interface Campaign {
    id: number;
    title: string;
    description: string;
    client_name: string;
    slug: string;
    status: string;
    questions: Question[];
    start_date: string | null;
    end_date: string | null;
}

interface Props {
    campaign: Campaign;
}

export default function SurveyShow({ campaign }: Props) {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState<'welcome' | 'survey' | 'completed'>('welcome');
    const [answers, setAnswers] = useState<Record<number, string | string[] | number>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    // Obtener ubicación del usuario
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.log('Error obteniendo ubicación:', error);
                }
            );
        }
    }, []);

    const startSurvey = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/encuesta/${campaign.slug}/iniciar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    latitude: location?.latitude,
                    longitude: location?.longitude
                })
            });

            if (!response.ok) {
                throw new Error('Error al iniciar la encuesta');
            }

            const data = await response.json();
            setSessionId(data.session_id);
            setCurrentStep('survey');
        } catch (error) {
            setError('Error al iniciar la encuesta. Por favor, inténtalo de nuevo.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const submitSurvey = async () => {
        setLoading(true);
        setError(null);

        // Validar respuestas requeridas
        const requiredQuestions = campaign.questions.filter(q => q.required);
        const missingAnswers = requiredQuestions.filter(q => !answers[q.id]);

        if (missingAnswers.length > 0) {
            setError('Por favor, completa todas las preguntas obligatorias.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/encuesta/${campaign.slug}/enviar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    answers: Object.entries(answers).map(([questionId, answer]) => ({
                        question_id: parseInt(questionId),
                        answer: answer
                    }))
                })
            });

            if (!response.ok) {
                throw new Error('Error al enviar las respuestas');
            }

            setCurrentStep('completed');
        } catch (error) {
            setError('Error al enviar las respuestas. Por favor, inténtalo de nuevo.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId: number, value: any) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

        const renderQuestion = (question: Question) => {
        const value = answers[question.id] || '';

        // Asegurar que options sea un array
        const options = Array.isArray(question.options)
            ? question.options
            : (typeof question.options === 'string'
                ? JSON.parse(question.options)
                : []);

        switch (question.type) {
            case 'text':
                return (
                    <Input
                        value={value}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Tu respuesta..."
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                );

            case 'textarea':
                return (
                    <Textarea
                        value={value}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Tu respuesta..."
                        rows={4}
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                );

            case 'select':
                return (
                    <select
                        value={value}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                    >
                        <option value="">Selecciona una opción...</option>
                        {options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );

            case 'radio':
                return (
                    <div className="space-y-2">
                        {options.map((option: string, index: number) => (
                            <label key={index} className="flex items-center space-x-2 text-white">
                                <input
                                    type="radio"
                                    name={`question_${question.id}`}
                                    value={option}
                                    checked={value === option}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    className="text-blue-500"
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="space-y-2">
                        {options.map((option: string, index: number) => (
                            <label key={index} className="flex items-center space-x-2 text-white">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={Array.isArray(value) && value.includes(option)}
                                    onChange={(e) => {
                                        const currentValues = Array.isArray(value) ? value : [];
                                        if (e.target.checked) {
                                            handleAnswerChange(question.id, [...currentValues, option]);
                                        } else {
                                            handleAnswerChange(question.id, currentValues.filter(v => v !== option));
                                        }
                                    }}
                                    className="text-blue-500"
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                );

            default:
                return (
                    <Input
                        value={value}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Tu respuesta..."
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                );
        }
    };

    if (currentStep === 'welcome') {
        return (
            <>
                <Head title={campaign.title} />
                <div className="min-h-screen bg-black flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
                        <CardHeader className="text-center">
                            {/* Logo Woblis */}
                            <div className="flex justify-center mb-6">
                                <img
                                    src="/img/logoWoblis.png"
                                    alt="Woblis Logo"
                                    className="h-16 w-auto"
                                />
                            </div>

                            {/* Nombre de la empresa */}
                            <div className="text-sm text-gray-400 mb-2">
                                {campaign.client_name}
                            </div>

                            {/* Título en blanco */}
                            <CardTitle className="text-2xl font-bold text-white mb-2">
                                {campaign.title}
                            </CardTitle>

                            <p className="text-gray-300 mt-2">{campaign.description}</p>

                            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    {campaign.client_name}
                                </div>
                                {campaign.start_date && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        Desde {new Date(campaign.start_date).toLocaleDateString('es-ES')}
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                                <h3 className="font-medium text-white mb-2">Información importante:</h3>
                                <ul className="text-sm text-gray-300 space-y-1">
                                    <li>• Esta encuesta toma aproximadamente 5-10 minutos en completar</li>
                                    <li>• Tus respuestas son completamente anónimas</li>
                                    <li>• Puedes salir en cualquier momento</li>
                                    <li>• La información de ubicación es opcional y solo se usa para estadísticas</li>
                                </ul>
                            </div>

                            {location && (
                                <div className="flex items-center gap-2 text-sm text-green-400">
                                    <MapPin className="w-4 h-4" />
                                    Ubicación detectada para mejores estadísticas
                                </div>
                            )}

                            {error && (
                                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900 border border-red-600 rounded p-3">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <Button
                                onClick={startSurvey}
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                size="lg"
                            >
                                {loading ? 'Iniciando...' : 'Comenzar Encuesta'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    if (currentStep === 'survey') {
        return (
            <>
                <Head title={`${campaign.title} - Encuesta`} />
                <div className="min-h-screen bg-black p-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Header con logo y empresa */}
                        <Card className="mb-6 bg-gray-900 border-gray-700">
                            <CardHeader className="text-center">
                                <div className="flex justify-center mb-4">
                                    <img
                                        src="/img/logoWoblis.png"
                                        alt="Woblis Logo"
                                        className="h-12 w-auto"
                                    />
                                </div>
                                <div className="text-sm text-gray-400 mb-2">
                                    {campaign.client_name}
                                </div>
                                <CardTitle className="text-xl font-bold text-white">
                                    {campaign.title}
                                </CardTitle>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                                        {campaign.questions.length} pregunta{campaign.questions.length !== 1 ? 's' : ''}
                                    </Badge>
                                </div>
                            </CardHeader>
                        </Card>

                        <div className="space-y-6">
                            {campaign.questions.map((question, index) => (
                                <Card key={question.id} className="bg-gray-900 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-start gap-2">
                                            <span className="bg-blue-600 text-white text-sm font-medium px-2 py-1 rounded">
                                                {index + 1}
                                            </span>
                                            <span className="flex-1 text-white">
                                                {question.question}
                                                {question.required && (
                                                    <span className="text-red-400 ml-1">*</span>
                                                )}
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {renderQuestion(question)}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {error && (
                            <Card className="mt-6 border-red-600 bg-red-900">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 text-red-400">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="mt-6 bg-gray-900 border-gray-700">
                            <CardContent className="pt-6">
                                <Button
                                    onClick={submitSurvey}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    size="lg"
                                >
                                    {loading ? 'Enviando...' : 'Enviar Respuestas'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </>
        );
    }

    if (currentStep === 'completed') {
        return (
            <>
                <Head title="Encuesta Completada" />
                <div className="min-h-screen bg-black flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl text-center bg-gray-900 border-gray-700">
                        <CardContent className="pt-8 pb-8">
                            {/* Logo Woblis */}
                            <div className="flex justify-center mb-6">
                                <img
                                    src="/img/logoWoblis.png"
                                    alt="Woblis Logo"
                                    className="h-16 w-auto"
                                />
                            </div>

                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <h1 className="text-2xl font-bold text-white mb-2">
                                ¡Gracias por tu participación!
                            </h1>

                            <p className="text-gray-300 mb-6">
                                Tus respuestas han sido enviadas exitosamente. Tu opinión es muy valiosa para nosotros.
                            </p>

                            <Button
                                onClick={() => window.close()}
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                                Cerrar
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    return null;
}
