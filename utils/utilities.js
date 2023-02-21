const mysql = require("mysql2");
require("dotenv").config();
const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  console.log("Successful connection to the Database.")
);

const viewEmployees = () => {
    console.info('Successful function hit')
//   let dbQuery = db
//     .promise()
//     .query(
//       "SELECT employee.id, CONCAT(employee.first_name,' ',employee.last_name) AS full_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM employee LEFT OUTER JOIN employee manager ON employee.manager_id = manager.id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id"
//     );
//   return dbQuery;
};

//! At the end of the file
module.exports = { viewEmployees };
