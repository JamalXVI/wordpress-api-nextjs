# Projeto Docker: Integração de WordPress, Laravel e Next.js com MySQL

Este projeto configura um ambiente Docker contendo os seguintes serviços integrados: WordPress, Laravel, Next.js e um banco de dados MySQL.

## Estrutura do Projeto

A aplicação é composta por:

- **MySQL**: Banco de dados responsável pelo armazenamento de dados para WordPress e Laravel.
- **WordPress**: Sistema de gerenciamento de conteúdo (CMS), configurado para usar o banco de dados MySQL.
- **Laravel**: Framework PHP para desenvolvimento backend, integrado ao banco de dados MySQL e com acesso à API do WordPress.
- **Next.js**: Framework React para o frontend, consumindo as APIs do WordPress e Laravel.
- **WP-CLI**: Interface de linha de comando para gerenciar o WordPress.

---

## Pré-requisitos

- [Docker](https://www.docker.com/) instalado na máquina.
- [Docker Compose](https://docs.docker.com/compose/) instalado.

---

## Serviços no Docker Compose

### 1. **MySQL (`db`)**

Banco de dados MySQL v5.6 usado pelo WordPress e Laravel.

- **Imagem utilizada**: `mysql:5.6`
- **Portas**: `3306`
- **Credenciais do Banco**:
    - `MYSQL_ROOT_PASSWORD`: `root`
- **Volumes**:
    - `./db_data:/var/lib/mysql`: Persistência dos dados do banco.
    - `./mysql/init-mysql:/docker-entrypoint-initdb.d`: Scripts de inicialização do banco.
    - `./mysql/mysql_always_init:/always-initdb.d`: Scripts que sempre irão rodar na inicialização.
    - `./mysql/mysql-entrypoint.sh:/custom-entrypoint.sh`: Entrypoint personalizado.
- **Saúde do Serviço** (`healthcheck`):
    - Testa a conectividade via `mysqladmin ping`.
    - Configurações:
        - `start_period`: 5 segundos
        - `interval`: 5 segundos
        - `timeout`: 5 segundos
        - `retries`: 55 tentativas
- **Entrypoint**: Script customizado `/custom-entrypoint.sh`.
- **Comando**: Inicia o serviço com `mysqld`.

---

### 2. **WordPress (`wordpress`)**

Sistema de gerenciamento de conteúdo (CMS) configurado para se conectar ao MySQL.

- **Build**:
    - Contexto: `./wordpress-api`.
    - Arquivo Dockerfile: `Dockerfile`.
- **Portas**:
    - `8000` (host) → `80` (container).
- **Volumes**:
    - `./wordpress-api/config/php.conf.ini:/usr/local/etc/php/conf.d/php.ini`: Configuração do PHP.
    - `./wordpress-api/content:/var/www/html`: Conteúdo do WordPress.
    - `./wordpress-api/health.php:/var/www/html/health.php`: Script de verificação de saúde.
- **Variáveis de Ambiente**:
    - `WORDPRESS_DB_HOST`: `db:3306`
    - `WORDPRESS_DB_USER`: `wordpress`
    - `WORDPRESS_DB_PASSWORD`: `wordpress`
    - `WORDPRESS_DB_NAME`: `wordpress`
    - `JWT_AUTH_SECRET_KEY`: `test_secret_key`
- **Saúde do Serviço** (`healthcheck`):
    - Verifica o script `health.php`:
        - `interval`: 60 segundos.
        - `timeout`: 5 segundos.
        - `retries`: 3 vezes.
        - `start_period`: 15 segundos.
- **Dependências**:
    - O serviço só inicia quando o banco (`db`) está saudável.

---

### 3. **WP-CLI (`wpcli`)**

Interface de linha de comando para gerenciar o WordPress. Permite executar comandos diretamente relacionados ao gerenciamento do WordPress, como instalação inicial e manutenção.

- **Build**:
    - Contexto: `./wp-cli`.
- **Imagem utilizada**: `tatemz/wp-cli`
- **Volumes**:
    - `./wordpress-api/content:/var/www/html`: Conteúdo do WordPress.
    - `./wordpress-api/plugins:/plugins`: Diretório dos plugins do WordPress.
- **Dependências**:
    - O serviço exige que **MySQL** (`db`) e **WordPress** (`wordpress`) estejam saudáveis para iniciar.
- **Variáveis de Ambiente**:
    - `WORDPRESS_DB_HOST`: `db:3306`
    - `WORDPRESS_SITE_URL`: `http://localhost:8000`
    - `WORDPRESS_SITE_TITLE`: `Meu Site CLI`
    - `WORDPRESS_ADMIN_USER`: `admin`
    - `WORDPRESS_ADMIN_PASSWORD`: `admin`
    - `WORDPRESS_ADMIN_EMAIL`: `admin@example.com`
- **Comando**: Realiza a instalação inicial do WordPress usando o comando `[ "install" ]`.

---

### 4. **Next.js (`nextjs`)**

Aplicação frontend utilizando Next.js.

- **Build**:
    - Contexto: `./front-end`.
    - Arquivo Dockerfile: `Dockerfile`.
- **Portas**:
    - `3000` (host) → `3000` (container).
- **Dependências**:
    - Depende dos serviços `wordpress` e `laravel` para consumo das APIs.

---

### 5. **Laravel (`laravel`)**

API backend construída com Laravel, integrada ao MySQL e com comunicação com a API do WordPress.

- **Build**:
    - Contexto: `./laravel-api`.
    - Arquivo Dockerfile: `Dockerfile`.
- **Portas**:
    - `8001` (host) → `8000` (container).
- **Volumes**:
    - `./laravel-api:/var/www/html`: Sincronização do código do Laravel.
- **Variáveis de Ambiente**:
    - `DB_HOST`: `db`
    - `DB_DATABASE`: `laravel`
    - `DB_USERNAME`: `laravel`
    - `DB_PASSWORD`: `laravel`
    - `WP_API_BASE_URL`: `http://wordpress_app/wp-json/wp/v2`
    - `WP_API_JWT_TOKEN`: `test_secret_key`
    - `APP_URL`: `http://localhost:8001`
    - `SESSION_DOMAIN`: `localhost`
    - `APP_KEY`: `base64:LDWAUvKcL/Rp6uql12M2Rhb+AFs+F3xEB4kyWwGT2HQ=`
- **Saúde do Serviço** (`healthcheck`):
    - Verifica o endpoint `/health`:
        - Intervalo: 30 segundos.
        - Timeout: 15 segundos.
        - Retentativas: 3 vezes.
        - Período de inicialização: 150 segundos.
- **Dependências**:
    - O serviço exige que o banco (`db`) esteja saudável para iniciar.

---

### Redes

Todos os serviços estão conectados a uma rede Docker chamada `wordpress_nextjs_network_app` configurada como:

- **Driver**: `bridge`.

---

## Como Iniciar o Ambiente

1. **Clonar o repositório**:
   ```bash
   git clone <seu-repositorio>
   cd <seu-repositorio>
   ```

2. **Iniciar o Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Acessar os serviços**:

    - **WordPress**: [http://localhost:8000](http://localhost:8000)
    - **Next.js**: [http://localhost:3000](http://localhost:3000)
    - **Laravel**: [http://localhost:8001](http://localhost:8001)

---

## Estrutura de Arquivos

```plaintext
.
├── db_data/                      # Dados persistentes do MySQL
├── mysql/
│   ├── init-mysql/               # Scripts de inicialização one-time do MySQL
│   ├── mysql_always_init/        # Scripts que sempre iniciam com o banco
│   └── mysql-entrypoint.sh       # Entrypoint personalizado para o MySQL
├── wordpress-api/
│   ├── Dockerfile                # Dockerfile para o WordPress
│   └── ...                       # Código do WordPress
├── laravel-api/
│   ├── Dockerfile                # Dockerfile para o Laravel
│   └── ...                       # Código do Laravel
├── front-end/
│   ├── Dockerfile                # Dockerfile para o Next.js
│   └── ...                       # Código do Frontend
├── wp-cli/
│   └── ...                       # Arquivos de configuração do WP-CLI
└── docker-compose.yml            # Configuração do Docker Compose
```

---

## Personalizações

- **Banco de Dados**:
    - Ajustar os scripts em `./mysql` para criar múltiplas tabelas, bancos ou alterar permissões.
- **WordPress**:
    - Alterar o Dockerfile em `./wordpress-api/Dockerfile` para instalar temas, plugins ou configurações padrão.
- **Laravel**:
    - Configurações adicionais podem ser feitas no `.env` ou direto nas variáveis do `docker-compose.yml`.
- **Next.js**:
    - Atualizar o frontend para consumir novas rotas da API do WordPress e Laravel.

---

## Licença

Este projeto está licenciado sob a licença [MIT](LICENSE). Sinta-se à vontade para usá-lo e modificá-lo!