FROM wordpress:latest

RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && \
    chmod +x wp-cli.phar && \
    mv wp-cli.phar /usr/local/bin/wp

WORKDIR /var/www/html/wp-content/plugins

RUN mkdir "tarefas-cpt-api"

WORKDIR /

COPY ./wp-content/plugins/tarefas-cpt-api/tarefas-cpt-api.php /var/www/html/wp-content/plugins/tarefas-cpt-api/tarefas-cpt-api.php
COPY ./wp-content/plugins/tarefas-cpt-api/composer.json /var/www/html/wp-content/plugins/tarefas-cpt-api/composer.json

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["apache2-foreground"]
