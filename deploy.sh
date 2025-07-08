#!/bin/bash

# Script de deploy para Laravel Cloud
echo "🚀 Iniciando deploy..."

# Limpiar cache de rutas
echo "🧹 Limpiando cache de rutas..."
php artisan route:clear-cache

# Limpiar otros caches
echo "🧹 Limpiando otros caches..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Optimizar para producción
echo "⚡ Optimizando para producción..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ejecutar migraciones
echo "🗄️ Ejecutando migraciones..."
php artisan migrate --force

# Limpiar logs
echo "📝 Limpiando logs..."
php artisan log:clear

echo "✅ Deploy completado exitosamente!"
