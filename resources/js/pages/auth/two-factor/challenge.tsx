import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLoginLayout from '@/layouts/auth/auth-login-layout';

export default function TwoFactorChallenge() {
    const [mode, setMode] = useState<'code' | 'recovery'>('code');

    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        recovery_code: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('two-factor.challenge'), {
            onFinish: () => reset(),
        });
    };

    return (
        <AuthLoginLayout
            title="Verificación de Dos Factores"
            description={
                mode === 'code'
                    ? "Por favor ingresa el código de tu aplicación de autenticación"
                    : "Por favor ingresa uno de tus códigos de recuperación"
            }
        >
            <Head title="Verificación 2FA - Woblis" />

            <form onSubmit={submit} className="space-y-6">
                {mode === 'code' ? (
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
                            autoFocus
                        />
                        <InputError message={errors.code} />
                    </div>
                ) : (
                    <div className="grid gap-2">
                        <Label htmlFor="recovery_code">Código de Recuperación</Label>
                        <Input
                            id="recovery_code"
                            type="text"
                            value={data.recovery_code}
                            onChange={(e) => setData('recovery_code', e.target.value)}
                            placeholder="Ingresa un código de recuperación"
                            autoComplete="off"
                            autoFocus
                        />
                        <InputError message={errors.recovery_code} />
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Verificar
                    </Button>

                    {mode === 'code' ? (
                        <Button
                            type="button"
                            variant="link"
                            className="text-[#7FFF00] hover:text-[#6FEF00]"
                            onClick={() => {
                                setMode('recovery');
                                reset();
                            }}
                        >
                            Usar código de recuperación
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="link"
                            className="text-[#7FFF00] hover:text-[#6FEF00]"
                            onClick={() => {
                                setMode('code');
                                reset();
                            }}
                        >
                            Usar código de autenticación
                        </Button>
                    )}
                </div>
            </form>
        </AuthLoginLayout>
    );
}
