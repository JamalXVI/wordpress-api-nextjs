#!/bin/bash
set -e

cd /var/www/html

: "${DB_HOST:=db}"
: "${DB_PORT:=3306}"
: "${DB_DATABASE:=laravel}"
: "${DB_USERNAME:=root}"
: "${DB_PASSWORD:=}"

sed -i "s/^DB_CONNECTION=.*/DB_CONNECTION=mysql/g" .env

sed -i "s/^DB_HOST=.*/DB_HOST=${DB_HOST}/g" .env
sed -i "s/^DB_PORT=.*/DB_PORT=${DB_PORT}/g" .env
sed -i "s/^DB_DATABASE=.*/DB_DATABASE=${DB_DATABASE}/g" .env
sed -i "s/^DB_USERNAME=.*/DB_USERNAME=${DB_USERNAME}/g" .env
sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=${DB_PASSWORD}/g" .env

echo "[ENTRYPOINT] .env atualizado com DB_HOST=${DB_HOST}, DB_PORT=${DB_PORT}, DB_DATABASE=${DB_DATABASE}, DB_USERNAME=${DB_USERNAME}"

if [ -z "$(grep '^APP_KEY=' .env)" ] || [ "$(grep '^APP_KEY=' .env | cut -d '=' -f2)" == "" ]; then
  echo "[ENTRYPOINT] Gerando chave de aplicação (APP_KEY)..."
  php artisan key:generate --ansi
fi

php artisan config:clear

#php artisan route:clear
#php artisan view:clear


php artisan migrate --force -vvv


php artisan tinker --execute="if(!\App\Models\User::exists()){ \App\Models\User::create(['name'=>'root','email'=>'root@example.com','password'=>bcrypt('root')]); }"


exec php artisan serve --host=0.0.0.0 --port=8000
