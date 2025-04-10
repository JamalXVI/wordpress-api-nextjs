#!/bin/bash
set -e

cd /var/www/html


#php artisan config:clear
#php artisan route:clear
#php artisan view:clear


php artisan migrate --force -vvv


php artisan tinker --execute="if(!\App\Models\User::exists()){ \App\Models\User::create(['name'=>'root','email'=>'root@example.com','password'=>bcrypt('root')]); }"


exec php artisan serve --host=0.0.0.0 --port=8000
