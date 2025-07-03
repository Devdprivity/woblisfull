# Woblis

Plataforma de investigación de mercado que conecta empresas con datos reales de consumidores a través de campañas de encuestas y análisis de tendencias.

## Características

### 🎯 Campañas de Encuestas
- Creación y gestión de campañas de investigación
- Encuestas personalizables con múltiples tipos de preguntas
- Seguimiento en tiempo real de respuestas
- Análisis de resultados y métricas

### 📊 Dashboard Analítico
- Gráficos interactivos (barras, líneas, torta)
- Filtros de tiempo (día, semana, mes)
- Exportación de datos a Excel
- Métricas de rendimiento en tiempo real

### 👥 Gestión de Usuarios
- Roles diferenciados (Admin, Empresa, Usuario)
- Autenticación con Google OAuth
- Perfiles de empresa con información completa
- Sistema de activación de cuentas

### 📝 Sistema de Contenido
- Blog integrado (Woblog)
- Comentarios y likes
- Gestión de posts por administradores
- Búsqueda de contenido

### 💰 Planes de Suscripción
- Planes Pyme y Corporativos
- Diferentes niveles de respuestas incluidas
- Gestión de características por plan
- Precios dinámicos desde base de datos

## Tecnologías

### Backend
- **Laravel 11** - Framework PHP
- **PostgreSQL** - Base de datos
- **Inertia.js** - SPA sin API
- **Sanctum** - Autenticación

### Frontend
- **React 18** - Biblioteca de interfaz
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Recharts** - Gráficos interactivos
- **Shadcn/ui** - Componentes UI

### Herramientas
- **Vite** - Bundler y servidor de desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código

## Instalación

### Prerrequisitos
- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL 13+

### Configuración

1. **Clonar el repositorio**
```bash
git clone https://github.com/Devdprivity/woblis.git
cd woblis
```

2. **Instalar dependencias de PHP**
```bash
composer install
```

3. **Instalar dependencias de Node.js**
```bash
npm install
```

4. **Configurar el archivo .env**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configurar la base de datos**
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=woblis
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

6. **Ejecutar migraciones y seeders**
```bash
php artisan migrate --seed
```

7. **Compilar assets**
```bash
npm run build
```

8. **Crear usuario administrador**
```bash
php artisan create:admin-user
```

## Desarrollo

### Servidor de desarrollo
```bash
# Terminal 1 - Servidor Laravel
php artisan serve

# Terminal 2 - Servidor Vite
npm run dev
```

### Comandos útiles
```bash
# Ejecutar tests
php artisan test

# Linting
npm run lint

# Formatear código
npm run format

# Compilar para producción
npm run build
```

## Estructura del Proyecto

```
woblis/
├── app/
│   ├── Http/Controllers/     # Controladores
│   ├── Models/              # Modelos Eloquent
│   ├── Providers/           # Proveedores de servicios
│   └── Console/Commands/    # Comandos Artisan
├── resources/
│   ├── js/
│   │   ├── components/      # Componentes React
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── layouts/        # Layouts de página
│   │   └── types/          # Tipos TypeScript
│   └── css/                # Estilos CSS
├── routes/
│   ├── web.php             # Rutas web
│   ├── auth.php            # Rutas de autenticación
│   └── admin.php           # Rutas de administración
└── database/
    ├── migrations/         # Migraciones
    └── seeders/           # Seeders
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Woblis - [@woblis](https://twitter.com/woblis) - contacto@woblis.com

Enlace del proyecto: [https://github.com/Devdprivity/woblis](https://github.com/Devdprivity/woblis)

---
*Última actualización: 2024* 
