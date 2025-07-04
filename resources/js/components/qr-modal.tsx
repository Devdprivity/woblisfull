import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Download, Mail, MessageCircle, Copy, Check } from "lucide-react";
// Toast notifications - using simple alert for now
const toast = {
    success: (message: string) => alert(message),
    error: (message: string) => alert(message)
};

interface QRModalProps {
    campaignSlug: string;
    campaignTitle: string;
    children: React.ReactNode;
}

export default function QRModal({ campaignSlug, campaignTitle, children }: QRModalProps) {
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);

    const surveyUrl = `${window.location.origin}/encuesta/${campaignSlug}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(surveyUrl)}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(surveyUrl);
            setCopied(true);
            toast.success("¡Enlace copiado al portapapeles!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Error al copiar el enlace");
        }
    };

    const shareViaWhatsApp = () => {
        const message = `¡Participa en nuestra encuesta! ${campaignTitle} - ${surveyUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const shareViaEmail = async () => {
        if (!email) {
            toast.error("Por favor ingresa un email");
            return;
        }

        setSending(true);
        try {
            // Aquí podrías hacer una llamada a tu API para enviar el email
            // Por ahora, simularemos el envío
            await new Promise(resolve => setTimeout(resolve, 1000));

            const subject = encodeURIComponent(`Invitación a participar: ${campaignTitle}`);
            const body = encodeURIComponent(`Hola,\n\nTe invitamos a participar en nuestra encuesta: ${campaignTitle}\n\nPuedes acceder aquí: ${surveyUrl}\n\n¡Gracias por tu participación!`);
            const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

            window.location.href = mailtoUrl;
            toast.success("Email preparado para enviar");
            setEmail("");
        } catch {
            toast.error("Error al preparar el email");
        } finally {
            setSending(false);
        }
    };

    const downloadQR = () => {
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `qr-${campaignSlug}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("QR descargado");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <QrCode className="w-5 h-5" />
                        Código QR - {campaignTitle}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* QR Code */}
                    <div className="flex justify-center">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <img
                                src={qrCodeUrl}
                                alt="QR Code"
                                className="w-48 h-48"
                            />
                        </div>
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Enlace de la encuesta:</label>
                        <div className="flex gap-2">
                            <Input
                                value={surveyUrl}
                                readOnly
                                className="flex-1"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={copyToClipboard}
                                className="flex items-center gap-1"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Sharing Options */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Compartir:</label>

                        {/* WhatsApp */}
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                            onClick={shareViaWhatsApp}
                        >
                            <MessageCircle className="w-4 h-4 text-green-500" />
                            Compartir por WhatsApp
                        </Button>

                        {/* Email */}
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="email@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    className="flex-1"
                                />
                                <Button
                                    variant="outline"
                                    onClick={shareViaEmail}
                                    disabled={sending}
                                    className="flex items-center gap-1"
                                >
                                    <Mail className="w-4 h-4" />
                                    {sending ? "Enviando..." : "Enviar"}
                                </Button>
                            </div>
                        </div>

                        {/* Download QR */}
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                            onClick={downloadQR}
                        >
                            <Download className="w-4 h-4" />
                            Descargar QR
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
