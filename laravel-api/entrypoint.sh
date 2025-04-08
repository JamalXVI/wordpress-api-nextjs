#!/bin/bash
set -e
composer install --no-interaction --prefer-dist
if [ ! -f storage/.breeze_installed ]; then

    composer require laravel/breeze --dev -vvv

    php artisan breeze:install blade --no-interaction -vvv

    if [ -f package.json ]; then
      npm install --verbose
      npm run dev --verbose &
    fi

    touch storage/.breeze_installed

fi

php artisan migrate --force -vvv

exec php artisan serve --host=0.0.0.0 --port=8000
