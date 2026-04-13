# ─── Stage 1: Node – compilar assets frontend ─────────────────────────────────
FROM node:22-alpine AS node-builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY resources/ resources/
COPY public/ public/
COPY vite.config.ts tsconfig.json components.json ./
RUN npm run build

# ─── Stage 2: Composer – instalar dependencias PHP ────────────────────────────
FROM composer:2 AS composer-builder

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist

COPY . .
RUN composer dump-autoload --optimize

# ─── Stage 3: Imagen final – PHP-FPM + Nginx ──────────────────────────────────
FROM php:8.2-fpm-alpine AS production

# Instalar dependencias del sistema y extensiones PHP
RUN apk add --no-cache \
    nginx \
    curl \
    supervisor \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-client \
    libpq-dev \
    oniguruma-dev \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        pgsql \
        mbstring \
        zip \
        exif \
        pcntl \
        bcmath \
        gd \
        opcache

WORKDIR /var/www/html

# Copiar dependencias PHP
COPY --from=composer-builder /app/vendor ./vendor
COPY --from=composer-builder /app .

# Copiar assets compilados
COPY --from=node-builder /app/public/build ./public/build

# Configurar Nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Configurar Supervisor (PHP-FPM + Nginx + queue worker)
COPY docker/supervisord.conf /etc/supervisord.conf

# Configurar OPcache para producción
COPY docker/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Permisos de storage y bootstrap/cache
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Script de entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
