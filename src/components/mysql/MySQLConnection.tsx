import React, { useState } from 'react'
import { Redirect, useLocation } from 'react-router-dom';
import { connection, showDatabases, showTables } from '../../services/MySQLQueryService';

export default function MySQLConnection() {
  const location = useLocation();
  const locationState = location.state || { host: null, user: '', password: '', database: ''};
  const [state, setState] = useState({
    ...locationState,
    redirect: '',
    shouldShowDatabases: true,
    redirectParams: {},
    databases: [],
    tables: [],
  });

  if (state.shouldShowDatabases) {
    const _connection = connection(state);
    showDatabases(_connection).then(response => {
      if (response) {
        let databases: any[] = [];
        response.map((res: { Database: any; }) => {
          databases.push(res.Database)
        });

        setState({
          ...state,
          databases: databases,
          shouldShowDatabases: false
        });
      }
    });
    }

  const listTables = (databaseName: any) => {
    const _connection = connection({
      ...state,
      database: databaseName,
    });

    showTables(_connection).then(response => {
      if (response) {
        let tables: any[] = [];
        response.map((res: { Database: any; }) => {
          Object.keys(res).map(_res => {
            tables.push(res[_res]);
          })
        });

        setState({ ...state, tables: tables });
      }
    });
  }

  return (
    <div>
      <div>
        <div className="lg:w-3/12 bg-gray-800 p-2 text-sm text-gray-100 min-h-screen">
          <h3 className="mb-5 mt-5 text-gray-600 font-bold">CONNECTED TO<span className="text-gray-100 font-light ml-2 text-md">{state.host}</span></h3>
          <div className="mb-5">
            <h6 className="text-gray-600 font-bold text-sm">DATABASES {! state.databases || state.databases.length <= 0 ? '( Empty )' : ''}</h6>
            <ul className="mt-2 text-md">
              {state.databases && state.databases.length > 0 && state.databases.map((database: React.ReactNode, _id: string | number | null | undefined) => {
                return (
                  <li key={_id} onClick={() => listTables(database)} className="ml-2 mb-1">{database}</li>
                );
              })}
            </ul>
          </div>
          <div>
            <h6 className="text-gray-600 font-bold text-sm">TABLES {! state.tables || state.tables.length <= 0 ? '( Empty )' : ''}</h6>
            <ul className="mt-2 text-md">
              {state.tables && state.tables.length > 0 && state.tables.map((table: React.ReactNode, _id: string | number | null | undefined) => {
                return (
                  <li key={_id} className="ml-2 mb-1">{table}</li>
                );
              })}
            </ul>
          </div>
          <button type="button" className="bg-gray-600 text-gray-400 w-full p-2 rounded-md my-5 focus:outline-none" onClick={() => setState({ redirect: '/' })}>
            Exit Connection
          </button>
        </div>
      </div>
      {state.redirect && <Redirect to={{ pathname: state.redirect, state: state.redirectParams }} />}
    </div>
  );
}
