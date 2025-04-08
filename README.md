# Projeto Docker: Integração de WordPress, Laravel e Next.js com MySQL

Este projeto configura um ambiente Docker contendo os seguintes serviços integrados: WordPress, Laravel, Next.js e um banco de dados MySQL.

## Estrutura do Projeto

A aplicação é composta por:

- **MySQL**: Banco de dados responsável pelo armazenamento de dados para WordPress e Laravel.
- **WordPress**: Sistema de gerenciamento de conteúdo (CMS), configurado para usar o banco de dados MySQL.
- **Laravel**: Framework PHP para desenvolvimento backend, integrado ao banco de dados MySQL.
- **Next.js**: Framework React para o frontend, consumindo a API do WordPress.

---

## Pré-requisitos

- [Docker](https://www.docker.com/) instalado na máquina.
- [Docker Compose](https://docs.docker.com/compose/) instalado.

---

## Serviços no Docker Compose

### 1. **MySQL (`db`)**
Banco de dados MySQL v5.7 usado por WordPress e Laravel.

- **Image**: `mysql:5.7`
- **Portas**: `3306`
- **Credenciais do Banco**:
    - Usuário root: `root`
    - Senha: `root`
- **Volumes**:
    - `./db_data:/var/lib/mysql`: Persistência dos dados do banco.
    - `./scripts/init-multi-db.sql:/docker-entrypoint-initdb.d/init-multi-db.sql:ro`: Script de inicialização.

---

### 2. **WordPress (`wordpress`)**
O CMS WordPress configurado para integração com MySQL.

- **Dockerfile**: Localizado em `./wordpress-api/Dockerfile`.
- **Portas**:
    - `8000` (host) → `80` (container).
- **Variáveis de Ambiente**:
    - `WORDPRESS_DB_HOST`: Host do banco (`db:3306`).
    - `WORDPRESS_DB_USER`: `wordpress`
    - `WORDPRESS_DB_PASSWORD`: `wordpress`
    - `WORDPRESS_DB_NAME`: `wordpress`
    - `JWT_AUTH_SECRET_KEY`: Chave de autenticação para JWT.

---

### 3. **Next.js (`nextjs`)**
Aplicação frontend utilizando Next.js.

- **Dockerfile**: Localizado em `./Dockerfile.next`.
- **Portas**:
    - `3000` (host) → `3000` (container).
- **Dependência**: O serviço depende do WordPress para fornecer dados de API.

---

### 4. **Laravel (`laravel`)**
API backend construída com Laravel, integrada ao MySQL.

- **Dockerfile**: Localizado em `./laravel-api/Dockerfile`.
- **Portas**:
    - `8001` (host) → `8000` (container).
- **Volumens**:
    - `./laravel-api:/var/www/html`: Sincroniza o código do Laravel.
- **Variáveis de Ambiente**:
    - `DB_HOST`: Host do banco (`db`).
    - `DB_DATABASE`: `laravel`
    - `DB_USERNAME`: `laravel`
    - `DB_PASSWORD`: `laravel`.

---

### Redes

Todos os serviços estão conectados a uma rede Docker chamada `wordpress_nextjs_network_app` configurada como `driver: bridge`.

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
├── scripts/
│   └── init-multi-db.sql         # Script para inicialização do banco de dados
├── wordpress-api/
│   ├── Dockerfile                # Dockerfile para o WordPress
│   └── ...                       # Código do WordPress
├── laravel-api/
│   ├── Dockerfile                # Dockerfile para o Laravel
│   └── ...                       # Código do Laravel
├── Dockerfile.next               # Dockerfile para o Next.js
└── docker-compose.yml            # Configuração do Docker Compose
```

---

## Personalizações

- **Banco de Dados**:
    - Alterar configurações no arquivo `./scripts/init-multi-db.sql` para criar múltiplos bancos ou ajustar permissões.

- **WordPress**:
    - Modifique o arquivo `./wordpress-api/Dockerfile` para personalizações específicas.

- **Laravel**:
    - Sobrescreva configurações do `.env` ou edite as variáveis de ambiente no `docker-compose.yml`.

- **Next.js**:
    - Ajustar o código fonte para consumir a API do WordPress e Laravel conforme necessário.

---

## Comandos Úteis

- **Parar o ambiente**:
  ```bash
  docker-compose down
  ```

- **Excluir volumes**:
  ```bash
  docker-compose down -v
  ```

- **Reiniciar com build atualizado**:
  ```bash
  docker-compose up --build
  ```

---

## Contribuindo

1. Faça o fork do projeto.
2. Crie um branch para suas alterações:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. Faça o commit das alterações:
   ```bash
   git commit -m "Adiciona nova funcionalidade"
   ```
4. Envie para o branch:
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. Abra um Pull Request.

---

## Licença

Este projeto está licenciado sob a licença [MIT](LICENSE). Sinta-se à vontade para usá-lo e modificá-lo!