# 1) Build stage
FROM php:8.2-cli AS build

WORKDIR /var/www/html

# Instala libs do SO + node/npm (o API stack não usa assets, mas deixamos o nodejs caso queira testar localmente)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    git \
    nodejs \
    npm

# Instala extensões PHP necessárias
RUN docker-php-ext-install pdo_mysql mbstring

# Copia o Composer da imagem oficial (opcional, caso você precise usar o Composer no build)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copia o código da aplicação para o container
COPY . /var/www/html

# Opcional: Rodar composer install, criar .env e gerar APP_KEY (se ainda não tiver esses passos configurados)
# RUN composer install --no-interaction --prefer-dist \
#  && cp .env.example .env \
#  && php artisan key:generate --ansi --force

# 2) Runtime stage
FROM php:8.2-cli

# Aqui instalamos também as extensões necessárias no runtime
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring

WORKDIR /var/www/html

# Copia a aplicação já construída do estágio de build
COPY --from=build /var/www/html /var/www/html

EXPOSE 8000

# Define o entrypoint que faz as operações necessárias em runtime (migrations, criação de usuário etc.)
ENTRYPOINT ["/var/www/html/entrypoint.sh"]

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
