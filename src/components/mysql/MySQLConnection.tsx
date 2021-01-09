import React, { useState } from 'react'
import { Redirect, useLocation } from 'react-router-dom';
import { connection, showDatabases, showTables } from '../../services/MySQLQueryService';

export default function MySQLConnection() {
  const location = useLocation();
  const locationState = location.state || { host: null, user: '', password: '', database: ''};
  const [state, setState] = useState({
    ...locationState,
    redirect: '',
    redirectParams: {},
    databases: [],
    tables: [],
  });

  try {
    const _connection = connection(state);
    showDatabases(_connection).then(response => {
      if (response) {
        let databases = [];
        response.map(res => {
          databases.push(res.Database)
        });

        setState({ ...state, databases: databases });
      }
    });
  } catch (e) {
    setState({ redirect: '/mysql' });
  }

  const listTables = (databaseName) => {
    const _connection = connection({
      ...state,
      database: databaseName,
    });

    showTables(_connection).then(response => {
      if (response) {
        let databases = [];
        response.map(res => {
          databases.push(res.Database)
        });

        setState({ ...state, databases: databases });
      }
    });
  }

  return (
    <div>
      <h3>Connected to {state.host}</h3>
      <h6>Databases</h6>
      <ul>
        {state.databases.length > 0 && state.databases.map(database => {
          return (
            <li onClick={listTables(database)}>{database}</li>
          );
        })}
      </ul>
      <h6>Tables</h6>
      <ul>
        {state.tables.length > 0 && state.tables.map(table => {
          return (
            <li>{table}</li>
          );
        })}
      </ul>
      <button onClick={() => setState({ redirect: '/mysql/create-connection' })}>
        Exit Connection
      </button>
      {state.redirect && <Redirect to={{  pathname: state.redirect, state: state.redirectParams }} />}
    </div>
  );
}
