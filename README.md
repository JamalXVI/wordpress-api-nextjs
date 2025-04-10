# Projeto Docker: Integração de WordPress, Laravel e Next.js com MySQL

Este projeto configura um ambiente Docker contendo os seguintes serviços integrados: WordPress, Laravel, Next.js e um banco de dados MySQL.

## Estrutura do Projeto

A aplicação é composta por:

- **MySQL**: Banco de dados responsável pelo armazenamento de dados para WordPress e Laravel.
- **WordPress**: Sistema de gerenciamento de conteúdo (CMS), configurado para usar o banco de dados MySQL.
- **Laravel**: Framework PHP para desenvolvimento backend, integrado ao banco de dados MySQL e com acesso à API do WordPress.
- **Next.js**: Framework React para o frontend, consumindo as APIs do WordPress e Laravel.

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

#### **Notas Importantes**:

> ⚠️ **Pode demorar alguns minutos na primeira inicialização**

Devido à forma como o serviço foi projetado, especialmente ao aplicar os scripts de inicialização e regeneração do banco de dados, o MySQL pode levar alguns minutos para estar totalmente operacional na **primeira inicialização**.

---

> ⚠️ **Regeneração planejada para homologação e teste**

O banco de dados MySQL foi configurado para ser uma **base de homologação e teste**, ou seja:
- Ele será **regenerado sempre que iniciado**, descartando os dados anteriores.
- O WordPress também está configurado para **popular automaticamente** a base de dados caso não encontre as informações.

Isso garante que o ambiente esteja sempre em um estado limpo e funcional para fins de desenvolvimento e testes.

---

### 3. **Next.js (`nextjs`)**

Aplicação frontend utilizando Next.js.

- **Build**:
    - Contexto: Diretório raiz (`.`).
    - Arquivo Dockerfile: `Dockerfile.next`.
- **Portas**:
    - `3000` (host) → `3000` (container).
- **Dependências**:
    - Depende dos serviços `wordpress` e `laravel` para consumo das APIs.

---

### 4. **Laravel (`laravel`)**

API backend construída com Laravel, integrada ao MySQL e com comunicação com a API do WordPress.

- **Build**:
    - Contexto: `./laravel-api`.
    - Arquivo Dockerfile: `./laravel-api/Dockerfile`.
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
    - `WP_API_JWT_TOKEN`: Chave JWT para integrar com a API do WordPress (`test_secret_key`).
- **Dependências**:
    - Depende do serviço `db` e só inicia quando o estado de saúde estiver definido como saudável (`service_healthy`).

---

### Redes

Todos os serviços estão conectados a uma rede Docker chamada `wordpress_nextjs_network_app` configurada como:

- **Driver**: `bridge`

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
├── Dockerfile.next               # Dockerfile para o Next.js
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

## Comandos Úteis

### Parar o ambiente:
```bash
docker-compose down
```

### Excluir volumes:
```bash
docker-compose down -v
```

### Reiniciar o ambiente com build atualizado:
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