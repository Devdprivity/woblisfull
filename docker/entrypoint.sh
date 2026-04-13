#!/bin/sh
set -e

cd /var/www/html

# Esperar a que la DB esté disponible (útil en compose)
if [ -n "$DB_HOST" ]; then
    echo "Esperando base de datos en $DB_HOST..."
    until php -r "new PDO('pgsql:host=$DB_HOST;port=${DB_PORT:-5432};dbname=$DB_DATABASE', '$DB_USERNAME', '$DB_PASSWORD');" 2>/dev/null; do
        sleep 2
    done
    echo "Base de datos disponible."
fi

# Generar APP_KEY si no está seteada
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Crear enlace simbólico de storage
php artisan storage:link --force 2>/dev/null || true

# Ejecutar migraciones
php artisan migrate --force

# Limpiar y cachear configuración para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec "$@"
