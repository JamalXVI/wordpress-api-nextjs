FROM wordpress:cli

# Precisamos de permissões de root para instalar pacotes
USER root

# Instala a ferramenta make
RUN apk add --no-cache make

# Instalação do docker-compose-wait para aguardar dependências (opcional)
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

# Copia o Makefile e o entrypoint.sh para dentro do contêiner
ADD Makefile entrypoint.sh /scripts/
RUN chmod +x /scripts/entrypoint.sh

# Define o entrypoint
ENTRYPOINT ["/scripts/entrypoint.sh"]

# Retorna a execução para o usuário padrão do wordpress:cli (UID 33)
#USER 33:33

# Comando padrão do contêiner: nesse caso, executa o target "install"
CMD ["install"]
