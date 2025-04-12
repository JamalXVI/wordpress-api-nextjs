install:
	# Aguarda que o banco de dados esteja disponível (ajuste se necessário)
	/wait -t 120 -h db:3306

	# (Opcional) Ajusta permissões na pasta compartilhada para que o usuário www-data (UID 33) possa escrever
	echo "[MAKEFILE] Ajustando permissões em /var/www/html..."
	chown -R www-data:www-data /var/www/html || echo "[MAKEFILE] Aviso: Não foi possível ajustar permissões, verifique manualmente."

	# Copia os plugins do diretório montado (/plugins) para o diretório de plugins do WordPress
	echo "[MAKEFILE] Copiando plugins de /plugins para /var/www/html/wp-content/plugins..."
	cp -R /plugins/* /var/www/html/wp-content/plugins/ || echo "[MAKEFILE] Aviso: Não foi possível copiar os plugins."

	# Gera ou atualiza o wp-config.php com base nas variáveis de ambiente fornecidas
	echo "[MAKEFILE] Gerando wp-config.php a partir das variáveis de ambiente..."
	wp config create --force \
	  --dbname="$${WORDPRESS_DB_NAME}" \
	  --dbuser="$${WORDPRESS_DB_USER}" \
	  --dbpass="$${WORDPRESS_DB_PASSWORD}" \
	  --dbhost="$${WORDPRESS_DB_HOST}" \
	  --skip-check \
	  --allow-root

	# Adiciona as constantes necessárias para o plugin JWT e habilita a API REST
	echo "[MAKEFILE] Adicionando as constantes JWT_AUTH_SECRET_KEY e JWT_AUTH_CORS_ENABLE no wp-config.php..."
	wp config set JWT_AUTH_SECRET_KEY "$${WP_API_JWT_TOKEN}" --allow-root --path=/var/www/html
	wp config set JWT_AUTH_CORS_ENABLE true --raw --allow-root --path=/var/www/html

	# Opcional: Garante que a API REST esteja ativada (caso esteja desabilitada)
	wp config set WP_REST_API_DISABLED false --raw --allow-root --path=/var/www/html

	# Atualiza (ou gera) o arquivo .htaccess linha a linha
	echo "[MAKEFILE] Atualizando/gerando .htaccess..."
	echo "# BEGIN WordPress" > /var/www/html/.htaccess
	echo "RewriteEngine On" >> /var/www/html/.htaccess
	echo "RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]" >> /var/www/html/.htaccess
	echo "RewriteBase /" >> /var/www/html/.htaccess
	# Note que a barra invertida deve ser escapada (\\)
	echo "RewriteRule ^index\\.php$ - [L]" >> /var/www/html/.htaccess
	echo "RewriteCond %{REQUEST_FILENAME} !-f" >> /var/www/html/.htaccess
	echo "RewriteCond %{REQUEST_FILENAME} !-d" >> /var/www/html/.htaccess
	echo "RewriteRule . /index.php [L]" >> /var/www/html/.htaccess
	echo "# END WordPress" >> /var/www/html/.htaccess

	# Define uma estrutura de permalinks (necessária para ativar os endpoints da REST API)
	echo "[MAKEFILE] Definindo estrutura de permalinks..."
	wp rewrite structure '/%postname%/' --allow-root --path=/var/www/html

	# Executa o flush das regras de reescrita
	echo "[MAKEFILE] Executando wp rewrite flush..."
	wp rewrite flush --allow-root --path=/var/www/html

	# Verifica se o WordPress já está instalado; se não, instala-o
	@if ! wp --path=/var/www/html --allow-root core is-installed; then \
	  echo "[MAKEFILE] WordPress não está instalado. Instalando..."; \
	  wp --path=/var/www/html --allow-root core install \
	    --url="$${WORDPRESS_SITE_URL:-http://wordpress}" \
	    --title="$${WORDPRESS_SITE_TITLE:-Meu Site}" \
	    --admin_user="$${WORDPRESS_ADMIN_USER:-admin}" \
	    --admin_password="$${WORDPRESS_ADMIN_PASSWORD:-admin}" \
	    --admin_email="$${WORDPRESS_ADMIN_EMAIL:-admin@example.com}"; \
	else \
	  echo "[MAKEFILE] WordPress já está instalado. Pulando instalação."; \
	fi

	# Instala e ativa o plugin JWT Authentication for WP REST API
	echo "[MAKEFILE] Instalando e ativando o plugin JWT Authentication for WP REST API..."
	wp --path=/var/www/html --allow-root plugin install jwt-authentication-for-wp-rest-api --activate

	# Verifica e ativa o plugin customizado 'tarefas-cpt-api' e cria tarefas iniciais se não houver nenhuma
	echo "[MAKEFILE] Verificando plugin customizado 'tarefas-cpt-api'..."
	if wp --path=/var/www/html --allow-root plugin is-installed tarefas-cpt-api/tarefas-cpt-api.php; then \
	  echo "[MAKEFILE] Ativando plugin 'tarefas-cpt-api'..."; \
	  wp --path=/var/www/html --allow-root plugin activate tarefas-cpt-api/tarefas-cpt-api.php; \
	  TASK_COUNT=`wp --path=/var/www/html --allow-root post list --post_type=tasks --format=count`; \
	  if [ "$$TASK_COUNT" -eq "0" ]; then \
	    echo "[MAKEFILE] Nenhuma tarefa encontrada. Criando tarefas iniciais..."; \
	    wp --path=/var/www/html --allow-root post create --post_type=tasks --post_status=publish --post_title="Teste de Tarefa" --post_content="Esta é a descrição de tarefa." --meta_input='{"status":"in progress","deadline":"2025-11-30"}'; \
	    wp --path=/var/www/html --allow-root post create --post_type=tasks --post_status=publish --post_title="Primeira Tarefa" --post_content="Esta é a descrição da primeira tarefa." --meta_input='{"status":"incomplete","deadline":"2025-12-31"}'; \
	    wp --path=/var/www/html --allow-root post create --post_type=tasks --post_status=publish --post_title="Segunda Tarefa" --post_content="Esta é a descrição da segunda tarefa." --meta_input='{"status":"in progress","deadline":"2025-11-30"}'; \
	    wp --path=/var/www/html --allow-root post create --post_type=tasks --post_status=publish --post_title="Terceira Tarefa" --post_content="Esta é a descrição da terceira tarefa." --meta_input='{"status":"in progress","deadline":"2025-10-30"}'; \
	    wp --path=/var/www/html --allow-root post create --post_type=tasks --post_status=publish --post_title="Quarta Tarefa" --post_content="Esta é a descrição da quarta tarefa." --meta_input='{"status":"in progress","deadline":"2026-01-30"}'; \
	    wp --path=/var/www/html --allow-root post create --post_type=tasks --post_status=publish --post_title="Quinta Tarefa" --post_content="Esta é a descrição da quinta tarefa." --meta_input='{"status":"in progress","deadline":"2026-01-30"}'; \
	  else \
	    echo "[MAKEFILE] Já existem $$TASK_COUNT tarefas cadastradas. Pulando criação de tarefas iniciais."; \
	  fi; \
	else \
	  echo "[MAKEFILE] Plugin 'tarefas-cpt-api' não encontrado. Pulando ativação."; \
	fi

	# Verifica se a API REST do WordPress está funcionando (usando o hostname 'wordpress')
	echo "[MAKEFILE] Verificando funcionamento da API REST do WordPress..."
	RESPONSE=`curl -s "http://wordpress/wp-json/"`
	echo "[MAKEFILE] Resposta da API REST:" $$RESPONSE

	echo "[MAKEFILE] Finalização da Configuração"
