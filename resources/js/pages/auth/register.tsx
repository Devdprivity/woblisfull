import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AuthLoginLayout from '@/layouts/auth/auth-login-layout';

type Plan = {
    id: number;
    name: string;
    slug: string;
    category: string;
    price: number;
    description: string;
    responses_included: number;
    delivery_time: string;
    features: string[];
    formatted_price: string;
};

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    account_type: 'client' | 'company';
    company_name: string;
    company_rut: string;
    company_address: string;
    company_phone: string;
    plan_id: number | null;
};

interface RegisterProps {
    plans: Plan[];
}

export default function Register({ plans }: RegisterProps) {
    const [selectedAccountType, setSelectedAccountType] = useState<'client' | 'company'>('client');

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        account_type: 'client',
        company_name: '',
        company_rut: '',
        company_address: '',
        company_phone: '',
        plan_id: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleAccountTypeChange = (type: 'client' | 'company') => {
        setSelectedAccountType(type);
        setData('account_type', type);
    };

    const formatPrice = (price: number): string => {
        return `$${price.toLocaleString('es-CL')}`;
    };

    return (
        <AuthLoginLayout
            title={selectedAccountType === 'company' ? "Crear Cuenta Empresa" : "Crear Cuenta"}
            description={selectedAccountType === 'company' ? "Selecciona tu plan y completa los datos de tu empresa" : "Completa tus datos para unirte a Woblis"}
        >
            <Head title="Registrarse - Woblis" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                {/* Account Type Selection */}
                <div className="grid gap-4">
                    <Label className="text-white font-medium text-center">
                        Tipo de Cuenta
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            type="button"
                            onClick={() => handleAccountTypeChange('client')}
                            className={`p-4 text-center transition-all duration-200 ${
                                selectedAccountType === 'client'
                                    ? 'bg-[#7FFF00] text-black border-[#7FFF00]'
                                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                            }`}
                            variant="outline"
                        >
                            <div>
                                <div className="font-semibold">Cliente</div>
                                <div className="text-xs opacity-80">Persona Individual</div>
                            </div>
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleAccountTypeChange('company')}
                            className={`p-4 text-center transition-all duration-200 ${
                                selectedAccountType === 'company'
                                    ? 'bg-[#7FFF00] text-black border-[#7FFF00]'
                                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                            }`}
                            variant="outline"
                        >
                            <div>
                                <div className="font-semibold">Empresa</div>
                                <div className="text-xs opacity-80">Cuenta Corporativa</div>
                            </div>
                        </Button>
                    </div>
                </div>

                {/* Plan Selection for Companies */}
                {selectedAccountType === 'company' && (
                    <div className="grid gap-4">
                        <Label className="text-white font-medium">
                            Selecciona tu Plan
                        </Label>
                        <div className="grid gap-3 max-h-96 overflow-y-auto">
                            {plans.map((plan) => (
                                <Card
                                    key={plan.id}
                                    className={`p-4 cursor-pointer transition-all duration-200 ${
                                        data.plan_id === plan.id
                                            ? 'bg-[#7FFF00]/20 border-[#7FFF00] text-white'
                                            : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                                    }`}
                                    onClick={() => setData('plan_id', plan.id)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg">{plan.name}</h3>
                                            <Badge variant="secondary" className="mt-1">
                                                {plan.category === 'pyme' ? 'PYME' : 'CORP'}
                                            </Badge>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-[#7FFF00]">
                                                {formatPrice(plan.price)}
                                            </div>
                                            <div className="text-xs opacity-70">
                                                {plan.responses_included} respuestas
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm opacity-80 mb-2">{plan.description}</p>
                                    <div className="text-xs opacity-60">
                                        Entrega: {plan.delivery_time}
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <InputError message={errors.plan_id} className="text-red-300" />
                    </div>
                )}

                {/* Basic Information */}
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-white font-medium">
                            {selectedAccountType === 'company' ? 'Nombre del Contacto' : 'Nombre Completo'}
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder={selectedAccountType === 'company' ? 'Nombre del representante' : 'Tu nombre completo'}
                            className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:border-[#7FFF00] focus:ring-[#7FFF00]/50 backdrop-blur-sm"
                        />
                        <InputError message={errors.name} className="text-red-300" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-white font-medium">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="tu@email.com"
                            className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:border-[#7FFF00] focus:ring-[#7FFF00]/50 backdrop-blur-sm"
                        />
                        <InputError message={errors.email} className="text-red-300" />
                    </div>
                </div>

                {/* Company Information */}
                {selectedAccountType === 'company' && (
                    <div className="grid gap-4">
                        <h3 className="text-white font-medium text-lg border-b border-white/30 pb-2">
                            Información de la Empresa
                        </h3>

                        <div className="grid gap-2">
                            <Label htmlFor="company_name" className="text-white font-medium">
                                Nombre de la Empresa
                            </Label>
                            <Input
                                id="company_name"
                                type="text"
                                required={selectedAccountType === 'company'}
                                tabIndex={3}
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                                disabled={processing}
                                placeholder="Nombre de tu empresa"
                                className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:border-[#7FFF00] focus:ring-[#7FFF00]/50 backdrop-blur-sm"
                            />
                            <InputError message={errors.company_name} className="text-red-300" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="company_rut" className="text-white font-medium">
                                RUT de la Empresa
                            </Label>
                            <Input
                                id="company_rut"
                                type="text"
                                required={selectedAccountType === 'company'}
                                tabIndex={4}
                                value={data.company_rut}
                                onChange={(e) => setData('company_rut', e.target.value)}
                                disabled={processing}
                                placeholder="12.345.678-9"
                                className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:border-[#7FFF00] focus:ring-[#7FFF00]/50 backdrop-blur-sm"
                            />
                            <InputError message={errors.company_rut} className="text-red-300" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="company_phone" className="text-white font-medium">
                                Teléfono de la Empresa
                            </Label>
                            <Input
                                id="company_phone"
                                type="tel"
                                required={selectedAccountType === 'company'}
                                tabIndex={5}
                                value={data.company_phone}
                                onChange={(e) => setData('company_phone', e.target.value)}
                                disabled={processing}
                                placeholder="+56 9 1234 5678"
                                className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:border-[#7FFF00] focus:ring-[#7FFF00]/50 backdrop-blur-sm"
                            />
                            <InputError message={errors.company_phone} className="text-red-300" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="company_address" className="text-white font-medium">
                                Dirección de la Empresa
                            </Label>
                            <Input
                                id="company_address"
                                type="text"
                                required={selectedAccountType === 'company'}
                                tabIndex={6}
                                value={data.company_address}
                                onChange={(e) => setData('company_address', e.target.value)}
                                disabled={processing}
                                placeholder="Dirección completa de la empresa"
                                className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:border-[#7FFF00] focus:ring-[#7FFF00]/50 backdrop-blur-sm"
                            />
                            <InputError message={errors.company_address} className="text-red-300" />
                        </div>
                    </div>
                )}

                {/* Password Fields */}
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-white font-medium">
                            Contraseña
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={selectedAccountType === 'company' ? 7 : 3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Crea una contraseña segura"
                            className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:border-[#7FFF00] focus:ring-[#7FFF00]/50 backdrop-blur-sm"
                        />
                        <InputError message={errors.password} className="text-red-300" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-white font-medium">
                            Confirmar Contraseña
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={selectedAccountType === 'company' ? 8 : 4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Repite tu contraseña"
                            className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:border-[#7FFF00] focus:ring-[#7FFF00]/50 backdrop-blur-sm"
                        />
                        <InputError message={errors.password_confirmation} className="text-red-300" />
                    </div>
                </div>

                {/* Company Notice */}
                {selectedAccountType === 'company' && (
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-yellow-100 text-sm">
                        <p className="font-medium mb-1">📋 Activación Requerida</p>
                        <p>Tu cuenta empresarial será activada por nuestro equipo después del registro. Te contactaremos dentro de 24 horas hábiles.</p>
                    </div>
                )}

                <Button
                    type="submit"
                    className="mt-4 w-full bg-[#7FFF00] hover:bg-[#6FEF00] text-black font-semibold py-3 transition-all duration-200 transform hover:scale-105"
                    tabIndex={selectedAccountType === 'company' ? 9 : 5}
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                    {selectedAccountType === 'company' ? 'Crear Cuenta Empresa' : 'Crear Cuenta'}
                </Button>

                {/* Google Sign Up for Individual Clients */}
                {selectedAccountType === 'client' && (
                    <>
                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/30" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-black/40 px-2 text-gray-300 backdrop-blur-sm">O regístrate con</span>
                            </div>
                        </div>

                        {/* Google Sign Up Button */}
                        <Button
                            type="button"
                            onClick={() => window.location.href = route('auth.google')}
                            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 border border-gray-300 transition-all duration-200 flex items-center justify-center gap-3"
                            tabIndex={6}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continuar con Google
                        </Button>
                    </>
                )}

                <div className="text-center text-sm text-gray-300">
                    ¿Ya tienes una cuenta?{' '}
                    <TextLink
                        href={route('login')}
                        tabIndex={selectedAccountType === 'company' ? 10 : 7}
                        className="text-[#7FFF00] hover:text-[#6FEF00] font-medium"
                    >
                        Iniciar Sesión
                    </TextLink>
                </div>
            </form>
        </AuthLoginLayout>
    );
}
