use mysql;

DELIMITER $$

CREATE PROCEDURE create_database_and_user(
    IN p_dbName VARCHAR(255),
    IN p_userName VARCHAR(255),
    IN p_userPassword VARCHAR(255)
)
BEGIN
    DECLARE dbExists INT DEFAULT 0;
    DECLARE usrExists INT DEFAULT 0;

SELECT COUNT(*) INTO dbExists
FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME = p_dbName;

IF dbExists = 0 THEN
        SET @sql = CONCAT('CREATE DATABASE IF NOT EXISTS `', p_dbName, '`;');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
END IF;

SELECT COUNT(*) INTO usrExists
FROM mysql.user
WHERE user = p_userName
  AND host = '%';

IF usrExists = 0 THEN
        SET @sql = CONCAT("CREATE USER '", p_userName, "'@'%' IDENTIFIED BY '", p_userPassword, "';");
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
END IF;
    SET @sql = CONCAT("GRANT ALL PRIVILEGES ON `", p_dbName, "`.* TO '", p_userName, "'@'%';");
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

FLUSH PRIVILEGES;
END $$

DELIMITER ;


CALL create_database_and_user('wordpress', 'wordpress', 'wordpress');
CALL create_database_and_user('laravel', 'laravel', 'laravel');


DROP PROCEDURE create_database_and_user;