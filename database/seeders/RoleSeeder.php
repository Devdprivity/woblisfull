<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'client',
                'display_name' => 'Cliente',
                'description' => 'Usuario cliente individual que se registra con Gmail',
                'permissions' => [
                    'read_blog',
                    'comment_blog',
                    'like_posts',
                ],
            ],
            [
                'name' => 'company_pending',
                'display_name' => 'Empresa Pendiente',
                'description' => 'Empresa registrada pendiente de activación por administrador',
                'permissions' => [
                    'read_blog',
                ],
            ],
            [
                'name' => 'company_active',
                'display_name' => 'Empresa Activa',
                'description' => 'Empresa con cuenta activa que puede usar los servicios',
                'permissions' => [
                    'read_blog',
                    'comment_blog',
                    'like_posts',
                    'access_dashboard',
                    'request_surveys',
                    'view_reports',
                ],
            ],
            [
                'name' => 'admin',
                'display_name' => 'Administrador',
                'description' => 'Administrador del sistema con acceso completo',
                'permissions' => [
                    'read_blog',
                    'comment_blog',
                    'like_posts',
                    'access_dashboard',
                    'manage_blog',
                    'manage_users',
                    'manage_companies',
                    'manage_plans',
                    'activate_companies',
                    'view_all_reports',
                    'admin_panel',
                ],
            ],
        ];

        foreach ($roles as $roleData) {
            Role::updateOrCreate(
                ['name' => $roleData['name']],
                $roleData
            );
        }
    }
}
