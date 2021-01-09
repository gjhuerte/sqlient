import React, { useState } from 'react'
import { Redirect } from 'react-router-dom';
import { connection } from '../../services/MySQLQueryService';

export default function CreateMySQLConnection() {
  const [state, setState] = useState({
    user: 'homestead',
    password: 'secret',
    host: '192.168.10.10',
    port: '3306',
    redirect: '',
    loading: false,
    redirectParams: {
      errorMessage: '',
      user: '',
      password: '',
      host: '',
      port: '',
    },
  });

  function connect() {
    setState({ ...state, loading: true });

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
            loading: false,
            redirectParams: {
              errorMessage: 'Server Error: ' + err.code,
              user: '',
              password: '',
              host: '',
              port: '',
            },
          });

          return;
        }

        setState({
          ...state,
          loading: false,
          redirectParams: {
            user: state.user,
            password: state.password,
            host: state.host,
            port: state.port,
            errorMessage: '',
          },
          redirect: '/mysql',
        });
      });
    } catch (e) {}
  }

  return (
    <div className="">
      <div>
        <div>
            {state.redirectParams.errorMessage && <p className="p-2 text-sm bg-red-200 text-red-700 rounded-md my-2">{state.redirectParams.errorMessage}</p>}
            <div className="flex flex-col mb-2">
              <label className="font-medium text-gray-400 text-sm">HOST</label>
              <input type="text" placeholder="127.0.0.1" className="bg-gray-200 text-gray-700 p-2 rounded-md mt-1 focus:outline-none" onChange={e => setState({ ...state, host: e.target.value })} value={state.host} />
            </div>
            <div className="flex flex-col mb-2">
              <label className="font-medium text-gray-400 text-sm">PORT</label>
              <input type="text" placeholder="3306" className="bg-gray-200 text-gray-700 p-2 rounded-md mt-1 focus:outline-none" onChange={e => setState({ ...state, port: e.target.value })} value={state.port} />
            </div>
            <div className="flex flex-col mb-2">
              <label className="font-medium text-gray-400 text-sm">USER</label>
              <input type="text" placeholder="root" className="bg-gray-200 text-gray-700 p-2 rounded-md mt-1 focus:outline-none" onChange={e => setState({ ...state, user: e.target.value })} value={state.user} />
            </div>
            <div className="flex flex-col mb-2">
              <label className="font-medium text-gray-400 text-sm">PASSWORD</label>
              <input type="password" placeholder="root" className="bg-gray-200 text-gray-700 p-2 rounded-md mt-1 focus:outline-none" onChange={e => setState({ ...state, password: e.target.value })} value={state.password} />
            </div>
            <button className={state.loading ? 'mt-2 p-2 rounded-md bg-blue-700 text-blue-50 text-md focus:outline-none' : 'mt-2 p-2 rounded-md bg-blue-700 text-blue-50 text-md focus:outline-none hover:text-blue-200'} disabled={state.loading} onClick={connect}>
              {state.loading ? 'Connecting...' : 'CONNECT'}
            </button>
        </div>
      </div>
      {state.redirect && <Redirect to={{  pathname: state.redirect, state: state.redirectParams }} />}
    </div>
  );
}
