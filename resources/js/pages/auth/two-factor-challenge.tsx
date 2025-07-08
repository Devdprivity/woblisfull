import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import { Card } from '@/components/ui/card';
import { ShieldCheck, Key, Shield, Loader2 } from 'lucide-react';

export default function TwoFactorChallenge() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('two-factor.store'));
    };

    return (
        <AuthSimpleLayout>
            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 p-2 flex items-center justify-center">
                        <ShieldCheck className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Verificación de dos factores
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Por favor, ingresa el código de verificación de tu aplicación autenticadora
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <Card className="px-6 py-8 sm:rounded-xl sm:px-12 shadow-2xl bg-white/80 backdrop-blur">
                        <form className="space-y-6" onSubmit={submit}>
                            <div className="space-y-2">
                                <Label htmlFor="code" className="text-gray-900">
                                    Código de verificación
                                </Label>
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

                            <div>
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500">
                                    ¿Perdiste acceso a tu aplicación autenticadora?{' '}
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                        Usa un código de recuperación
                                    </a>
                                </p>
                            </div>
                        </form>
                    </Card>

                    <div className="mt-8 text-center">
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <Shield className="h-4 w-4" />
                            <span>Protegido por autenticación de dos factores</span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthSimpleLayout>
    );
}
