# Projeto Docker: Integração de WordPress, Laravel e Next.js com MySQL

Este projeto configura um ambiente Docker que integra os seguintes serviços:

- **MySQL**:  
  Banco de dados para WordPress e Laravel.

- **WordPress**:  
  CMS configurado para usar MySQL e que expõe endpoints REST (incluindo autenticação JWT e um plugin
  customizado para tarefas).

- **Laravel**:  
  API backend em Laravel, integrada ao MySQL e atuando como _proxy_ / gateway para chamadas à API do
  WordPress.  
  O Laravel utiliza o [Sanctum](https://laravel.com/docs/sanctum) para autenticação via API.

- **Next.js**:  
  Aplicação frontend (React) que consome as APIs do Laravel e do WordPress.

- **WP-CLI**:  
  Ferramenta de linha de comando para gerenciamento do WordPress, utilizada para configurar o
  ambiente automaticamente (instalação, configuração, criação de usuário, etc).

---

## Estrutura de Arquivos

```plaintext
.
├── db_data/                      # [Git Ignore] Dados persistentes do MySQL
├── front-end/
│   └── ...                       # Código do Frontend
├── mysql/
│   ├── init-mysql/               # Scripts de inicialização one-time do MySQL
│   ├── mysql_always_init/        # Scripts que sempre iniciam com o banco
│   ├── Dockerfile                # Dockerfile do Mysql
│   └── mysql-entrypoint.sh       # Entrypoint personalizado para o MySQL
├── wordpress-api/
│   ├── config                    # Arquivo contendo o php.ini a ser copiado para a máquina
│   ├── content                   # [Git Ignore] Pasta da máquina do docker do wordpress
│   ├── plugins                   # Código dos plugins customizados do wordpress
│   ├── Dockerfile                # Dockerfile do wordpress
│   └── health.php                # Arquivo php com o script de health check a ser copiado para a máquina
├── laravel-api/
│   ├── Dockerfile                # Dockerfile para o Laravel
│   ├── entrypoint.sh             # Script de comandos de entradas para o Laravel 
│   └── ...                       # Código do Laravel
├── wp-cli/
│   ├── Dockerfile                # Dockerfile para o Wordpress CLI
│   ├── entrypoint.sh             # Script de comandos de entradas para o Wordpress CLI 
│   └── Makerfile                 # Makerfile do Wordpress CLI (Somente o Install)
└── docker-compose.yml            # Configuração do Docker Compose
```

## Estrutura do Projeto

A aplicação é composta por:

- **MySQL (`db`)**  
  Banco de dados MySQL v5.6 usado pelo WordPress e Laravel.

    - **Imagem utilizada**: `mysql:5.6`

    - **Portas**: `3306`

    - **Credenciais do Banco**:
        - `MYSQL_ROOT_PASSWORD`: `root`

    - **Volumes**:
        - `./db_data:/var/lib/mysql`: Persistência dos dados do banco.
        - `./mysql/init-mysql:/docker-entrypoint-initdb.d`: Scripts de inicialização one-time do
          banco.
        - `./mysql/mysql_always_init:/always-initdb.d`: Scripts que sempre serão executados na
          inicialização.
        - `./mysql/mysql-entrypoint.sh:/custom-entrypoint.sh`: Entrypoint personalizado para o
          MySQL.

    - **Healthcheck**:
        - Testa a conectividade via `mysqladmin ping` com as configurações:
            - `start_period`: 5 segundos
            - `interval`: 5 segundos
            - `timeout`: 5 segundos
            - `retries`: 55 tentativas

    - **Entrypoint**: Script customizado `/custom-entrypoint.sh`

    - **Comando**: Inicia o serviço com `mysqld`.


- **WordPress (`wordpress`)**  
  Sistema de gerenciamento de conteúdo (CMS) configurado para se conectar ao MySQL.

    - **Build**:
        - Contexto: `./wordpress-api`
        - Arquivo Dockerfile: `Dockerfile`

    - **Portas**:
        - `8000` (host) → `80` (container)

    - **Volumes**:
        - `./wordpress-api/config/php.conf.ini:/usr/local/etc/php/conf.d/php.ini`: Configuração
          personalizada do PHP.
        - `./wordpress-api/content:/var/www/html`: Conteúdo do WordPress.
        - `./wordpress-api/health.php:/var/www/html/health.php`: Script para verificação de saúde.

    - **Variáveis de Ambiente**:
        - `WORDPRESS_DB_HOST`: `db:3306`
        - `WORDPRESS_DB_USER`: `wordpress`
        - `WORDPRESS_DB_PASSWORD`: `wordpress`
        - `WORDPRESS_DB_NAME`: `wordpress`
        - `JWT_AUTH_SECRET_KEY`: `test_secret_key`

    - **Healthcheck**:
        - Baseado no script `health.php`, com:
            - `interval`: 60 segundos
            - `timeout`: 5 segundos
            - `retries`: 3
            - `start_period`: 15 segundos

    - **Dependências**:
        - Só inicia se o serviço de MySQL (`db`) estiver saudável.


- **WP-CLI (`wpcli`)**  
  Interface de linha de comando para gerenciamento do WordPress.

    - **Build**:
        - Contexto: `./wp-cli`

    - **Imagem Utilizada**: `tatemz/wp-cli`

    - **Volumes**:
        - `./wordpress-api/content:/var/www/html`: Conteúdo do WordPress.
        - `./wordpress-api/plugins:/plugins`: Diretório dos plugins.

    - **Dependências**:
        - Depende dos serviços `db` e `wordpress` para iniciar.

    - **Variáveis de Ambiente**:
        - `WORDPRESS_DB_HOST`, `WORDPRESS_SITE_URL`, `WORDPRESS_SITE_TITLE`, `WORDPRESS_ADMIN_USER`,
          `WORDPRESS_ADMIN_PASSWORD`, `WORDPRESS_ADMIN_EMAIL`

    - **Comando**:
        - Executa o entrypoint que chama o comando `install` do WP-CLI para configurar o WordPress (
          incluindo criação do `wp-config.php`, definição de constantes e `.htaccess`).


- **Laravel (`laravel`)**  
  API backend construída com Laravel, integrada ao MySQL e com comunicação com a API do WordPress.

    - **Build**:
        - Contexto: `./laravel-api`
        - Arquivo Dockerfile: `Dockerfile`

    - **Portas**:
        - `8001` (host) → `8000` (container)

    - **Volumes**:
        - `./laravel-api:/var/www/html`: Sincronização do código do Laravel.

    - **Variáveis de Ambiente**:
        - `DB_HOST`: `db`
        - `DB_DATABASE`: `laravel`
        - `DB_USERNAME`: `laravel`
        - `DB_PASSWORD`: `laravel`
        - `WP_API_BASE_URL`: Ex.: `http://wordpress_app/wp-json/wp/v2`
        - `WP_API_JWT_TOKEN`: `test_secret_key`
        - `APP_URL`: `http://localhost:8001`
        - `SESSION_DOMAIN`: `localhost`
        - `APP_KEY`: Gerado pelo comando Artisan (ex.:
          `base64:LDWAUvKcL/Rp6uql12M2Rhb+AFs+F3xEB4kyWwGT2HQ=`)

    - **Healthcheck**:
        - Verifica o endpoint `/health` com:
            - `interval`: 30 segundos
            - `timeout`: 15 segundos
            - `retries`: 3
            - `start_period`: 75 segundos

    - **Autenticação**:
        - Utiliza **Laravel Sanctum** para autenticação via API.

    - **Entrypoint**:
        - Executa migrações, cria um usuário padrão (caso não exista) e inicia o servidor:
          ```bash
          php artisan serve --host=0.0.0.0 --port=8000
          ```


- **Next.js (`nextjs`)**  
  Aplicação frontend usando Next.js.

    - **Build**:
        - Contexto: `./front-end`

    - **Portas**:
        - `3000`

    - **Dependências**:
        - Depende dos serviços `wordpress` e `laravel` para consumo das APIs.

    - **Frontend**:
        - Implementa um "wizard" de autenticação de dois passos:
            1. Login no WordPress (para obter o token JWT).
            2. Login no Laravel (para obter o token do Sanctum).

        - Após ambos os logins, exibe a listagem das tasks obtidas via o endpoint `/api/tasks` do
          Laravel.

---

## Pré-requisitos

1. **Docker e Docker Compose**:
    - Certifique-se de que o [Docker](https://www.docker.com/) está instalado e funcionando
      corretamente em seu sistema.
    - Também instale o [Docker Compose](https://docs.docker.com/compose/) para orquestrar os
      serviços definidos no arquivo `docker-compose.yml`.

2. **Acesso ao Terminal**:
    - Utilize um terminal de sua escolha: `bash` no Linux ou macOS, `PowerShell` ou `CMD` no
      Windows. Certifique-se de que o terminal está configurado para acessar os comandos do Docker.

3. **Node.js (Versão LTS)**:
    - Baixe e instale o [Node.js](https://nodejs.org/) na versão LTS (Long Term Support). O Node.js
      é necessário para executar e desenvolver o frontend deste projeto.

4. **Gerenciador de Pacotes (npm ou yarn)**:
    - Instale o [npm](https://www.npmjs.com/) (normalmente incluso na instalação do Node.js) ou
      o [yarn](https://yarnpkg.com/) para gerenciar dependências e executar os comandos do Next.js.

5. **Confirmação de Instalações**:
    - Após realizar as instalações, confirme que todas as ferramentas acima estão disponíveis
      utilizando os comandos abaixo no terminal:
      ```bash
      docker --version      # Valida a instalação do Docker
      docker-compose --version  # Valida a instalação do Docker Compose
      node --version        # Verifica se a versão do Node.js está correta
      npm --version         # Confirma o funcionamento do npm
      yarn --version        # (Opcional) Confirma o funcionamento do yarn, caso opte por utilizá-lo
      ```

---

## Configurando o Ambiente

1. **Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd <seu-repositorio>
   ```
2. **Ajuste as variáveis de ambiente**
   Verifique as configurações em seu arquivo .env ou nas variáveis do docker-compose.yml para
   credenciais e URLs.

3. **Inicie os serviços**
    - Use o Docker Compose para iniciar o WordPress, o MySQL e o Laravel:
      ```bash
      docker-compose up --build
      ```
    - Acesse a pasta do frontend (`front-end`) e inicie o Next.js manualmente:
      ```bash
      cd front-end
      npm install
      npm run dev
      ```
Isso criará e iniciará todos os containers e serviços.

4. **Acesse os serviços**

   ➡️ **WordPress**: [http://localhost:8000](http://localhost:8000)

   ➡️ **Laravel**: [http://localhost:8001](http://localhost:8001)

   ➡️ **Next.js**: [http://localhost:3000](http://localhost:3000)

## Personalizações e Desenvolvimento
1. **WordPress**:
 - Dockerfile em `./wordpress-api/Dockerfile`
 - Arquivo de configuração do PHP: `./wordpress-api/config/php.conf.ini`
 - Conteúdo, temas e plugins podem ser gerenciados em `./wordpress-api/content` e `./wordpress-api/plugins`
2. **Laravel**:
 - Código da API: `./laravel-api`
 - Ajuste controllers, rotas (em `routes/web.php` ou `routes/api.php`) e lógica de negócios conforme necessário.

3. **Postman Collection**:

- Já existe uma collection Postman exportada para facilitar as requisições às APIs do projeto.
- A collection inclui as seguintes requisições configuradas:
    - **[Wordpress] Auth**: Autenticação no WordPress CMS para obter o token JWT.
    - **[Wordpress] Lista Tarefas**: Consulta as tarefas disponíveis no WordPress via REST API.
    - **[Laravel] Auth**: Autenticação na API Laravel para obter o token de acesso utilizando
      Laravel Sanctum.
    - **[Laravel] Get Tasks**: Recupera a lista de tarefas da API do Laravel, integrando o token JWT
      do WordPress para vincular funcionalidades.
    - **[Laravel] Health Check**: Verifica a saúde e disponibilidade da API Laravel.

- Arquivo completo da collection: `desafio.postman_collection.json`.
    - Esse arquivo pode ser importado diretamente no Postman para começar os testes e integração com
      as APIs.
    - A collection inclui variáveis configuráveis para simplificar o ajuste de URLs e tokens, como
      `WORDPRESS_URL`, `LARAVEL_URL`, `WORDPRESS_TOKEN`, e `LARAVEL_TOKEN`.
