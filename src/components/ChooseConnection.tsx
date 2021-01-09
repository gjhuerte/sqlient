import React from 'react';
import {
  Link,
  useRouteMatch,
} from 'react-router-dom';

export default function ChooseConnection () {
  let match = useRouteMatch();

  return (
    <div>
      <h3>Choose Connection</h3>
      <ul>
        <li>
          <Link to='/mysql/create-connection'>MySQL</Link>
        </li>
        <li>
          <Link to='/mongodb'>MongoDB</Link>
        </li>
      </ul>
    </div>
  );
}
