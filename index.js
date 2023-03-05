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
const updateRole = [];
function menuPrompts() {
  inquirer.prompt(startMenu).then((answers) => {
    switch (answers.initialChoice) {
      case "View All Employees":
        viewEmployees();
        break;
      case "Add Employee":
        addEmployeePrompt();
        break;
      case "Update Employee Role":
        updateEmployeePrompt();
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
        console.log("Successfully created Employee");
      }
    );
    menuPrompts();
  });
};

const updateEmployeePrompt = () => {
  const employeeList = [];
  const roleList = [];
  let employeeId = 0;
  let roleId = 0;

  db.query("SELECT * FROM employee", (err, data) => {
    if (err) {
      throw err;
    } else {
      for (let index = 0; index < data.length; index++) {
        employeeList.push(
          data[index].id +
            " " +
            data[index].first_name +
            " " +
            data[index].last_name
        );
      }
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which Employee's role needs updated?",
            name: "update1",
            choices() {
              return employeeList;
            },
          },
        ])
        .then((answers) => {
          employeeId = Number(answers.update1.split(" ")[0]);
          console.log(employeeId);
          db.query("SELECT * FROM role", (err, data) => {
            if (err) {
              throw err;
            } else {
              for (let index = 0; index < data.length; index++) {
                roleList.push(data[index].id + " " + data[index].title);
              }
              inquirer
                .prompt([
                  {
                    type: "list",
                    message:
                      "Which role do you want to assign the selected employee?",
                    name: "update2",
                    choices() {
                      return roleList;
                    },
                  },
                ])
                .then((answers) => {
                  roleId = Number(answers.update2.split(" ")[0]);
                  db.query(
                    `UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`
                  );
                })
                .then((answers) => {
                  console.log("Role Successfully Updated");
                  menuPrompts();
                });
            }
          });
        });
    }
  });
};

menuPrompts();
