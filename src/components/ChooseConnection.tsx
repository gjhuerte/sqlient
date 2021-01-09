import React from 'react';
import CreateMySQLConnection from './mysql/CreateMySQLConnection';
import mysqlIcon from '../../app/images/mysql.png';
import mongodbIcon from '../../app/images/mongodb.png';

export default function ChooseConnection () {
  return (
    <div class="p-10 flex w-screen h-screen">
      <div class="flex flex-col justify-center content-stretch w-full">
        <div>
          <div class="flex flex-row justify-center content-stretch mb-2">
            <div class="p-5 rounded-lg bg-gray-50 shadow-md w-6/12">
              <h3 class="text-gray-400 font-medium text-sm">CHOOSE CONNECTION</h3>
              <ul class="flex flex-row my-2">
                <li>
                  <button class="text-gray-700 hover:text-gray-400 font-md font-medium mr-5 border-2 border-green-200 rounded-md focus:outline-none">
                    <img src={mysqlIcon} class="h-20"/>
                  </button>
                </li>
                <li>
                  <button class="text-gray-700 hover:text-gray-400 text-md font-medium mr-5 hover:border-green-200 hover:border-2 focus:outline-none">
                    <img src={mongodbIcon} class="h-20"/>
                  </button>
                </li>
              </ul>
              <CreateMySQLConnection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
