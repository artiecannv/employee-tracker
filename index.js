const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
require("dotenv").config();
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

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
];

const addEmployee = [
  {
    type: "input",
    message: "What is the employee's first name?",
    name: "addEmployee1",
  },
  {
    type: "input",
    message: "What is the employee's last name?",
    name: "addEmployee2",
  },
  {
    type: "input",
    message: "What is the employee's role?",
    name: "addEmployee3",
  },
  {
    type: "input",
    message: "What is the employee's manager?",
    name: "addEmployee4",
  },
];

function menuPrompts() {
  inquirer.prompt(startMenu).then((answers) => {
    switch (answers.initialChoice) {
      case "View All Employees":
        viewEmployees();
        break;
      case "Add Employee":
        addEmployee();
        break;

      default:
        console.log("Have a good day!");
        process.exit();
    }
  });
}

const viewEmployees = () => {
  db.query(
    "SELECT employee.id, CONCAT(employee.first_name,' ',employee.last_name) AS full_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM employee LEFT OUTER JOIN employee manager ON employee.manager_id = manager.id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id",
    (err, data) => {
      if (err) {
        throw err;
      } else {
        console.table(data);
      }
      menuPrompts();
    }
  );
};

const addEmployeePrompt = () => {
  inquirer.prompt(addEmployee).then((answers) => {
    db.query(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
      [
        answers.addEmployee1,
        answers.addEmployee2,
        answers.addEmployee3,
        answers.addEmployee4,
      ],
      (err, res) => {
        if (err) throw err;
        console.log("Successfully created Employee")
      }
    );
  });
};

menuPrompts();
