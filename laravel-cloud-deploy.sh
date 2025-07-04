#!/bin/bash

# Laravel Cloud Deployment Script for Woblis
echo "🚀 Starting Laravel Cloud deployment for Woblis..."

# Set environment
export APP_ENV=production
export APP_DEBUG=false

# Create storage directories before anything else
echo "📁 Creating storage directories..."
STORAGE_DIRS=(
    "/var/www/html/storage/framework/views"
    "/var/www/html/storage/framework/cache"
    "/var/www/html/storage/framework/sessions"
    "/var/www/html/storage/logs"
    "/var/www/html/storage/app/public"
    "/var/www/html/bootstrap/cache"
)

for dir in "${STORAGE_DIRS[@]}"; do
    mkdir -p "$dir"
    chmod -R 775 "$dir"
    chown -R www-data:www-data "$dir" || true
done

# Set proper permissions for parent directories
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache
chown -R www-data:www-data /var/www/html/storage || true
chown -R www-data:www-data /var/www/html/bootstrap/cache || true

# Clear all caches first
echo "🧹 Clearing caches..."
php artisan cache:clear --quiet || true
php artisan config:clear --quiet || true
php artisan route:clear --quiet || true
php artisan view:clear --quiet || true

# Force migrations and seeders
echo "🗃️ Force running migrations..."
php artisan migrate --force

echo "🌱 Force running seeders..."
php artisan db:seed --force --class=CompanySeeder
php artisan db:seed --force --class=CampaignSeeder
php artisan db:seed --force --class=QuestionSeeder

# Cache configuration and routes
echo "⚡ Caching configuration..."
php artisan config:cache --quiet
php artisan route:cache --quiet

# Create storage link
echo "🔗 Creating storage link..."
php artisan storage:link --quiet || true

# Verify directories exist and have correct permissions
echo "🔍 Verifying directories and permissions..."
for dir in "${STORAGE_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "⚠️ Warning: Directory $dir does not exist"
        mkdir -p "$dir"
        chmod -R 775 "$dir"
        chown -R www-data:www-data "$dir" || true
    fi
done

echo "✅ Laravel Cloud deployment completed successfully!"
echo "🎉 Woblis is ready!"
