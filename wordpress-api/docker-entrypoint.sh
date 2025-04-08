#!/bin/bash
set -e


sleep 10

echo "[ENTRYPOINT] Verificando se o WordPress está instalado..."
if wp core is-installed --allow-root --path=/var/www/html; then
    echo "[ENTRYPOINT] WordPress já está instalado."
else
    echo "[ENTRYPOINT] WordPress não instalado. Por favor, instale o WordPress primeiro."
    exit 1
fi

echo "[ENTRYPOINT] Instalando e ativando o plugin JWT Authentication for WP REST API..."
wp plugin install jwt-authentication-for-wp-rest-api --activate --allow-root --path=/var/www/html

if wp plugin is-installed tarefas-cpt-api --allow-root --path=/var/www/html; then
    echo "[ENTRYPOINT] Ativando o plugin customizado 'tarefas-cpt-api'..."
    wp plugin activate tarefas-cpt-api --allow-root --path=/var/www/html
else
    echo "[ENTRYPOINT] Plugin 'tarefas-cpt-api' não encontrado, pulando ativação."
fi

echo "[ENTRYPOINT] Setup concluído. Iniciando o Apache..."
exec apache2-foreground
