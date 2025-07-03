<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buscar el rol de administrador
        $adminRole = Role::where('name', 'admin')->first();

        if (!$adminRole) {
            $this->command->error('❌ Rol de administrador no encontrado. Ejecuta RoleSeeder primero.');
            return;
        }

        // Crear usuario administrador si no existe
        if (!User::where('email', 'admin@woblis.cl')->exists()) {
            $admin = User::create([
                'name' => 'Administrador Woblis',
                'email' => 'admin@woblis.cl',
                'password' => Hash::make('admin123'),
                'account_type' => 'admin',
                'role_id' => $adminRole->id,
                'status' => 'active',
                'email_verified_at' => now(),
                'provider' => 'email',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->command->info('✅ Usuario administrador creado exitosamente.');
            $this->command->info('📧 Email: admin@woblis.cl');
            $this->command->info('🔑 Contraseña: admin123');
        } else {
            $this->command->info('⚠️  Usuario administrador ya existe.');
        }
    }
}
