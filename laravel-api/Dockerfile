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

# Copia o Composer da imagem oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copia o código da aplicação para o container
COPY . /var/www/html

# Executa as migrações (deixamos neste estágio para evitar rodar alterações em runtime)
RUN php artisan migrate --force

# 2) Runtime stage
FROM php:8.2-cli

WORKDIR /var/www/html

# Copia a aplicação já construída
COPY --from=build /var/www/html /var/www/html

EXPOSE 8000

# Define o entrypoint para executar tarefas leves de runtime (apenas limpeza, migrações e verificação de usuário, sem rodar composer)
ENTRYPOINT ["/var/www/html/entrypoint.sh"]

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
