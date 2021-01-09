import mysql from 'mysql';

export const connection = function (info) {
  return mysql.createConnection({
    host: info.host,
    user: info.user,
    password: info.password,
    database: info.database,
  });
}

export const showDatabases = function (connection) {
  return new Promise((res, rej) => {
    if (connection) {
      connection.connect();

      connection.query(`SHOW DATABASES`, function (error, results, fields) {
        if (error) rej(error);

        res(results);
      });

      connection.end();
    }
  });
}

export const showTables = function (connection) {
  return new Promise((res, rej) => {
    if (connection) {
      connection.connect();

      connection.query(`SHOW TABLES`, function (error, results, fields) {
        if (error) rej(error);

        res(results);
      });

      connection.end();
    }
  });
}
