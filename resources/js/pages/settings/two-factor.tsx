import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Shield, ShieldCheck, ShieldX, Smartphone, Key } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Two-Factor Authentication',
        href: '/settings/two-factor',
    },
];

type TwoFactorForm = {
    password: string;
    code: string;
};

export default function TwoFactor({
    qrCode,
    recoveryCodes,
    twoFactorEnabled = false
}: {
    qrCode?: string;
    recoveryCodes?: string[];
    twoFactorEnabled?: boolean;
}) {
    const [showingQrCode, setShowingQrCode] = useState(false);
    const [showingRecoveryCodes, setShowingRecoveryCodes] = useState(false);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<TwoFactorForm>({
        password: '',
        code: '',
    });

    const enableTwoFactor: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('two-factor.enable'), {
            preserveScroll: true,
            onSuccess: () => setShowingQrCode(true),
        });
    };

    const confirmTwoFactor: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('two-factor.confirm'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowingQrCode(false);
                setShowingRecoveryCodes(true);
            },
        });
    };

    const disableTwoFactor: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('two-factor.disable'), {
            preserveScroll: true,
        });
    };

    const regenerateRecoveryCodes: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('two-factor.recovery-codes'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Two-Factor Authentication" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Two-Factor Authentication"
                        description="Add additional security to your account using two-factor authentication"
                    />

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Authentication Status
                            </CardTitle>
                            <CardDescription>
                                {twoFactorEnabled
                                    ? "Two-factor authentication is currently enabled on your account."
                                    : "Two-factor authentication is not enabled on your account."
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-4">
                                {twoFactorEnabled ? (
                                    <>
                                        <ShieldCheck className="h-5 w-5 text-green-600" />
                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                            Enabled
                                        </Badge>
                                    </>
                                ) : (
                                    <>
                                        <ShieldX className="h-5 w-5 text-red-600" />
                                        <Badge variant="destructive">
                                            Disabled
                                        </Badge>
                                    </>
                                )}
                            </div>

                            {!twoFactorEnabled && (
                                <form onSubmit={enableTwoFactor} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Current Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Enter your current password"
                                            required
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <Button type="submit" disabled={processing}>
                                        <Smartphone className="h-4 w-4 mr-2" />
                                        Enable Two-Factor Authentication
                                    </Button>
                                </form>
                            )}

                            {twoFactorEnabled && showingQrCode && qrCode && (
                                <div className="space-y-4">
                                    <Alert>
                                        <Smartphone className="h-4 w-4" />
                                        <AlertDescription>
                                            Two-factor authentication is now enabled. Scan the following QR code using your phone's authenticator application or enter the setup key manually.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="flex flex-col items-center space-y-4">
                                        <div dangerouslySetInnerHTML={{ __html: qrCode }} />

                                        <form onSubmit={confirmTwoFactor} className="space-y-4 w-full max-w-sm">
                                            <div className="grid gap-2">
                                                <Label htmlFor="code">Authentication Code</Label>
                                                <Input
                                                    id="code"
                                                    type="text"
                                                    value={data.code}
                                                    onChange={(e) => setData('code', e.target.value)}
                                                    placeholder="Enter the code from your authenticator app"
                                                    required
                                                />
                                                <InputError message={errors.code} />
                                            </div>

                                            <Button type="submit" disabled={processing} className="w-full">
                                                <Key className="h-4 w-4 mr-2" />
                                                Confirm Two-Factor Authentication
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {twoFactorEnabled && showingRecoveryCodes && recoveryCodes && (
                                <div className="space-y-4">
                                    <Alert>
                                        <Key className="h-4 w-4" />
                                        <AlertDescription>
                                            Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two-factor authentication device is lost.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                                            {recoveryCodes.map((code, index) => (
                                                <div key={index} className="bg-white dark:bg-gray-700 p-2 rounded">
                                                    {code}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => setShowingRecoveryCodes(false)}
                                        variant="outline"
                                    >
                                        I've stored these codes safely
                                    </Button>
                                </div>
                            )}

                            {twoFactorEnabled && !showingQrCode && !showingRecoveryCodes && (
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={regenerateRecoveryCodes}
                                            variant="outline"
                                            disabled={processing}
                                        >
                                            <Key className="h-4 w-4 mr-2" />
                                            Regenerate Recovery Codes
                                        </Button>

                                        <Button
                                            onClick={() => setShowingQrCode(true)}
                                            variant="outline"
                                            disabled={processing}
                                        >
                                            <Smartphone className="h-4 w-4 mr-2" />
                                            Show QR Code
                                        </Button>
                                    </div>

                                    <form onSubmit={disableTwoFactor} className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="disable_password">Current Password</Label>
                                            <Input
                                                id="disable_password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Enter your current password"
                                                required
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <Button type="submit" variant="destructive" disabled={processing}>
                                            <ShieldX className="h-4 w-4 mr-2" />
                                            Disable Two-Factor Authentication
                                        </Button>
                                    </form>
                                </div>
                            )}

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-green-600 mt-2">
                                    Two-factor authentication settings updated successfully.
                                </p>
                            </Transition>
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
