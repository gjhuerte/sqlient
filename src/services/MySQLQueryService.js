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
    const queryString = `SHOW DATABASES`;
    if (connection) {
      connection.connect();

      connection.query(queryString, function (error, results, fields) {
        if (error) rej(error);

        res({ data: results, queryString: queryString});
      });

      connection.end();
    }
  });
};

export const showTables = function (connection) {
  return new Promise((res, rej) => {
    const queryString = `SHOW TABLES`;
    if (connection) {
      connection.connect();

      connection.query(queryString, function (error, results, fields) {
        if (error) rej(error);

        res({ data: results, queryString: queryString});
      });

      connection.end();
    }
  });
};

export const queryTable = function (connection, queryString, shouldClose = true) {
  return new Promise((res, rej) => {
    if (connection) {
      connection.query(queryString, function (error, results, fields) {
        if (error) rej(error);

        res({ data: results, queryString: queryString});
      });

      if (shouldClose) connection.end();
    }
  });
};
