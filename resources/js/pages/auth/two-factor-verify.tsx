import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Key, Loader2 } from 'lucide-react';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';

export default function TwoFactorVerify() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/verify-2fa');
    };

    return (
        <AuthSimpleLayout>
            <Card className="w-full max-w-lg mx-auto p-8">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            Verificación de dos factores
                        </h2>
                        <p className="mt-2 text-sm text-white">
                            Por favor, ingresa el código de 6 dígitos de tu aplicación de autenticación.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <Label htmlFor="code">Código de verificación</Label>
                            <div className="mt-2 relative">
                                <Input
                                    id="code"
                                    name="code"
                                    type="text"
                                    autoComplete="one-time-code"
                                    required
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    className="pl-10 text-center tracking-[1em] text-xl font-mono"
                                    maxLength={6}
                                    placeholder="000000"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                            {errors.code && (
                                <Alert variant="destructive" className="mt-2">
                                    {errors.code}
                                </Alert>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing ? (
                                <div className="flex items-center justify-center">
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    Verificando...
                                </div>
                            ) : (
                                'Verificar'
                            )}
                        </Button>
                    </form>
                </div>
            </Card>
        </AuthSimpleLayout>
    );
}
