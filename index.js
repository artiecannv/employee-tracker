const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
require("dotenv").config();
const db = mysql.createConnection(
  {
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }
);

// db.connect(function(error) {
//   if (error) throw error
// });


const startMenu = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "initialChoice",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit",
    ],
  },
  // {
  //     type: "",
  //     message: "",
  //     name: "",
  // }
];

function menuPrompts() {
    inquirer.prompt(startMenu)
    .then((answers) => {
      switch (answers.initialChoice) {
        case "View All Employees":
          viewEmployees()
          break;
      
        default:
          break;
      }
    })
    // exit = answers.initialChoice === "Quit" ? true : false;
}

const viewEmployees = () => {
  db.query("SELECT employee.id, CONCAT(employee.first_name,' ',employee.last_name) AS full_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM employee LEFT OUTER JOIN employee manager ON employee.manager_id = manager.id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id", (err, data) => {
    if (err) {
      throw err
    } else {
      console.table (data)
    }
  })
}

menuPrompts();
