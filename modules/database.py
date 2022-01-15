import mysql.connector as mysql_db
import config

db = mysql_db.connect(host=config.db_host, user=config.db_username, passwd=config.db_password,
                      database=config.database_name)
db.set_charset_collation('utf8mb4', 'utf8mb4_unicode_ci')
