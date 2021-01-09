import React, { useState } from 'react'
import { Redirect, useLocation } from 'react-router-dom';
import { connection, queryTable, showDatabases, showTables } from '../../services/MySQLQueryService';

export default function MySQLConnection() {
  const location = useLocation();
  const locationState = location.state || { host: null, user: '', password: '', database: ''};
  const [state, setState] = useState({
    ...locationState,
    redirect: '',
    shouldShowDatabases: true,
    queryString: '',
    redirectParams: {},
    databases: [],
    tables: [],
    tableColumns: [],
    tableContents: [],
  });

  if (state.shouldShowDatabases) {
    const _connection = connection(state);
    showDatabases(_connection).then(response => {
      if (response.data) {
        let databases: any[] = [];
        Object.keys(response.data).map(res => {
          databases.push(response.data[res].Database)
        });

        setState({
          ...state,
          databases: databases,
          shouldShowDatabases: false,
          queryString: response.queryString,
          tables: [],
          tableColumns: [],
          tableContents: [],
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
      if (response.data) {
        let tables: any[] = [];
        Object.keys(response.data).map(tableRow => {
          if (tableRow !== 'queryString') {
            Object.keys(response.data[tableRow]).map(rowDataPacket => {
              tables.push(response.data[tableRow][rowDataPacket]);
            })
          }
        });

        setState({
          ...state,
          tables: tables,
          queryString: response.queryString,
          database: databaseName,
          tableColumns: [],
          tableContents: [],
        });
      }
    });
  }

  const showTableContent = (tableName: string) => {
    const tableConnection1 = connection({
      host: state.host,
      port: state.port,
      user: state.user,
      password: state.password,
      database: state.database,
    });

    let queryString = `SHOW COLUMNS FROM ${tableName}`;

    queryTable(tableConnection1, queryString).then(response => {
      if (response) {
        let tableColumns: any[] = [];
        Object.keys(response.data).map(tableColumn => {
          if (tableColumn !== 'queryString') {
            tableColumns.push(response.data[tableColumn]);
          }
        });

        setState({
          ...state,
          tableColumns: tableColumns,
          queryString: response.queryString,
        });

        const tableConnection2 = connection({
          host: state.host,
          port: state.port,
          user: state.user,
          password: state.password,
          database: state.database,
        });

        queryString = `SELECT * FROM ${tableName} LIMIT 20`;

        queryTable(tableConnection2, queryString).then(response => {
          if (response) {
            let tableContents: any[] = [];
            Object.keys(response.data).map(tableContent => {
              if (tableContent !== 'queryString') {
                tableContents.push(response.data[tableContent]);
              }
            });

            setState({
              ...state,
              tableContents: tableContents,
              queryString: response.queryString,
            });
          }
        });
      }
    });
  }

  return (
    <div>
      <div className="flex flex-row">
        <div className="lg:w-3/12 bg-gray-800 p-2 text-sm text-gray-100 min-h-screen">
          <h3 className="mb-5 mt-5 text-gray-600 font-bold">CONNECTED TO<span className="text-gray-100 font-light ml-2 text-md">{state.host}</span></h3>
          <div className="mb-5">
            <h6 className="text-gray-600 font-bold text-sm">DATABASES {! state.databases || state.databases.length <= 0 ? '( Empty )' : ''}</h6>
            <ul className="mt-2 text-md">
              {state.databases && state.databases.length > 0 && state.databases.map((database: React.ReactNode, _id: string | number | null | undefined) => {
                return (
                  <li key={_id}className="ml-2 mb-1">
                    <button type="button" className="focus:outline-none" onClick={() => listTables(database)}>
                      {database}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h6 className="text-gray-600 font-bold text-sm">TABLES {! state.tables || state.tables.length <= 0 ? '( Empty )' : ''}</h6>
            <ul className="mt-2 text-md">
              {state.tables && state.tables.length > 0 && state.tables.map((table: string, _id: string) => {
                return (
                  <li key={_id} className="ml-2 mb-1">
                    <button type="button" className="focus:outline-none" onClick={() => showTableContent(table)}>
                      {table}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <button type="button" className="bg-gray-600 text-gray-400 w-full p-2 rounded-md my-5 focus:outline-none" onClick={() => setState({ redirect: '/' })}>
            Exit Connection
          </button>
        </div>
        <div className="lg:w-9/12 p-2 text-sm min-h-screen">
          <div className="mb-2">
            <input type="text" placeholder="Your query will appear here..." className="bg-gray-300 text-gray-700 p-2 rounded-md mt-1 focus:outline-none w-full" onChange={e => setState({ ...state, queryString: e.target.value })} value={state.queryString} />
          </div>
          <div className="mt-5">
            <table>
              <thead>
                <tr>
                  {state.tableColumns.length > 0 && state.tableColumns.map((columnName: { Field: React.ReactNode; }, _id: string) => {
                    console.log(columnName.Field)
                    return <th key={_id} className="mb-2 text-xs">{columnName.Field}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {state.tableContents && state.tableContents.length > 0 && state.tableContents.map((contents: any[], _id: string) => {
                  return (
                    <tr key={_id} className="mb-2 text-xs">
                      {Object.keys(contents).map((content, __id) => {
                        const contentString = (contents[content] || '').toString();
                        const str = contentString.length > 50 ? contentString.substr(0, 50) + '...' : contentString;
                        return <td key={__id}>{str}</td>
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {state.redirect && <Redirect to={{ pathname: state.redirect, state: state.redirectParams }} />}
    </div>
  );
}
