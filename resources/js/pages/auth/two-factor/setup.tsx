import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface SetupTwoFactorProps {
    qrCode: string;
    secret: string;
    recoveryCodes: string[];
}

export default function SetupTwoFactor({ qrCode, secret, recoveryCodes }: SetupTwoFactorProps) {
    const { data, setData, post, processing, errors } = useForm<Required<{ code: string }>>({
        code: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('two-factor.setup'));
    };

    return (
        <AuthLayout
            title="Configurar Autenticación de Dos Factores"
            description="Escanea el código QR con tu aplicación de autenticación y guarda tus códigos de recuperación"
        >
            <Head title="Configurar 2FA - Woblis" />

            <div className="space-y-6">
                {/* QR Code */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-white rounded-lg" dangerouslySetInnerHTML={{ __html: qrCode }} />
                    <p className="text-sm text-center text-muted-foreground">
                        Si no puedes escanear el código QR, usa este código secreto en tu aplicación:
                        <code className="block mt-2 p-2 bg-muted rounded text-center font-mono">{secret}</code>
                    </p>
                </div>

                {/* Recovery Codes */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Códigos de Recuperación</h3>
                    <p className="text-sm text-muted-foreground">
                        Guarda estos códigos en un lugar seguro. Podrás usarlos para acceder a tu cuenta si pierdes acceso a tu aplicación de autenticación.
                    </p>
                    <div className="p-4 bg-muted rounded-lg">
                        <pre className="text-sm font-mono">
                            {recoveryCodes.join('\n')}
                        </pre>
                    </div>
                </div>

                {/* Verification Form */}
                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="code">Código de Verificación</Label>
                            <Input
                                id="code"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="Ingresa el código de 6 dígitos"
                                maxLength={6}
                            />
                            <InputError message={errors.code} />
                        </div>

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Activar Autenticación de Dos Factores
                        </Button>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
