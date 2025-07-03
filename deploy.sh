#!/bin/bash

# Laravel Cloud Deployment Script
echo "🚀 Starting Woblis deployment..."

# Set proper permissions
echo "📁 Setting permissions..."
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Create necessary directories
echo "📁 Creating storage directories..."
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs
mkdir -p storage/app/public

# Set proper permissions for storage directories
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Run migrations
echo "🗃️ Running database migrations..."
php artisan migrate --force

# Run seeders
echo "🌱 Running database seeders..."
php artisan db:seed --force

# Optimize for production
echo "⚡ Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Link storage
echo "🔗 Creating storage link..."
php artisan storage:link

echo "✅ Deployment completed successfully!"
echo "🎉 Woblis is ready to rock!"
