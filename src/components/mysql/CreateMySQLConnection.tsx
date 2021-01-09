import React, { useState } from 'react'
import { Redirect, useLocation } from 'react-router-dom';
import { connection, showDatabases } from '../../services/MySQLQueryService';

export default function CreateMySQLConnection() {
  const [state, setState] = useState({
    user: 'homestead',
    password: 'secret',
    host: '192.168.10.10',
    redirect: '',
    redirectParams: {
      errorMessage: '',
      user: '',
      password: '',
      host: '',
    },
  });

  function connect(e) {

    try {
      const _connection = connection({
        user: state.user,
        password: state.password,
        host: state.host,
      });

      _connection.connect(function(err) {
        if (err) {
          setState({
            ...state,
            redirectParams: {
              errorMessage: 'Error connecting to server: ' + err.code,
            },
          });

          return;
        }

        setState({
          ...state,
          redirectParams: {
            user: state.user,
            password: state.password,
            host: state.host,
          },
          redirect: '/mysql',
        });
      });
    } catch (e) {}
  }

  return (
    <div>
      <h3>Create Connection - MYSQL</h3>
      {state.redirectParams.errorMessage && <p>{state.redirectParams.errorMessage}</p>}
      <div>
        <label>Host:</label>
        <input type="text" name="host" placeholder="Host" onChange={e => setState({ ...state, host: e.target.value })} value={state.host} />
      </div>
      <div>
        <label>User:</label>
        <input type="text" name="user" placeholder="User" onChange={e => setState({ ...state, user: e.target.value })} value={state.user} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" placeholder="Password" onChange={e => setState({ ...state, password: e.target.value })} value={state.password} />
      </div>
      <div>
        <button onClick={connect}>
          CONNECT
        </button>
        <button onClick={() => setState({ ...state, redirect: '/' })}>
          EXIT
        </button>
      </div>
      {state.redirect && <Redirect to={{  pathname: state.redirect, state: state.redirectParams }} />}
    </div>
  );
}
