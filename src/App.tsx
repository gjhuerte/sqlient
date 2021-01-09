import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ChooseConnection from './components/ChooseConnection';
import CreateMySQLConnection from './components/mysql/CreateMySQLConnection';
import MySQLConnection from './components/mysql/MySQLConnection';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/choose_connection">
          <ChooseConnection />
        </Route>
        <Route path="/mysql">
          <MySQLConnection />
        </Route>
        <Route path="/">
          <ChooseConnection />
        </Route>
      </Switch>
    </Router>
  );
}
