#!/bin/bash
set -e

sleep 10

if [ ! -f /var/www/html/wp-config.php ]; then
    exit 1
fi

cd /var/www/html/wp-content/plugins/tarefas-cpt-api
composer install --no-interaction --prefer-dist

wp plugin install jwt-authentication-for-wp-rest-api --activate --allow-root --path=/var/www/html

if wp plugin is-installed tarefas-cpt-api --allow-root --path=/var/www/html ; then
    wp plugin activate tarefas-cpt-api --allow-root --path=/var/www/html
fi

exec apache2-foreground
