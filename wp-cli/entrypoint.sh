#!/bin/sh
set -euo pipefail

echo "[ENTRYPOINT] Iniciando entrypoint com argumentos: $@"

# Se o primeiro argumento começar com '-', assumimos que é uma opção do wp-cli
if [ "${1#-}" != "$1" ]; then
  echo "[ENTRYPOINT] O primeiro argumento inicia com '-', prefixando com 'wp'"
	set -- wp "$@"
fi

# Se o primeiro argumento for um subcomando válido do wp-cli (ex: plugin, theme, help),
# invocamos via "wp" para permitir "docker run wpcli help", por exemplo.
if wp --path=/dev/null help "$1" > /dev/null 2>&1; then
  echo "[ENTRYPOINT] '$1' é um subcomando válido do wp-cli; executando com 'wp'"
	set -- wp "$@"
fi

# Se o comando for "install" ou "configure", chamamos o Makefile
# (ou seja, `docker-compose run wpcli install`)
if [ "$1" = "install" ] || [ "$1" = "configure" ]; then
  echo "[ENTRYPOINT] Comando '$1' detectado; chamando o Makefile..."
  make -f /scripts/Makefile "$1"
else
  echo "[ENTRYPOINT] Executando comando padrão: $@"
  exec "$@"
fi
