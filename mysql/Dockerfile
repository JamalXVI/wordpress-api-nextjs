FROM mysql:5.7

COPY mysql_init/init-mysql.sql /always-initdb.d/init-mysql.sql

COPY ./mysql-entrypoint.sh /usr/local/bin/custom-mysql-entrypoint.sh
RUN chmod +x /usr/local/bin/custom-mysql-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/custom-mysql-entrypoint.sh"]

CMD []
