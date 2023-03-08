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

const startMenu = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "initialChoice",
    choices: [
      "View All Employees", //
      "Add Employee", //
      "Update Employee Role", //
      "View All Roles", //
      "Add Role",
      "View All Departments", //
      "Add Department", //
      "Quit", //
    ],
  },
];

// Prompts

const addEmployeePrompt = [
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

const addDepartmentPrompt = [
  {
    type: "input",
    message: "What is the name of this Department?",
    name: "newDepartment",
  },
];

// Menu

function menuPrompts() {
  inquirer.prompt(startMenu).then((answers) => {
    switch (answers.initialChoice) {
      case "View All Employees":
        viewEmployees();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee Role":
        updateEmployee();
        break;
      case "View All Roles":
        viewAllRoles();
        break;
      case "Add Role":
        addRole();
        break;
      case "View All Departments":
        viewAllDepartments();
        break;
      case "Add Department":
        addDepartment();
        break;
      default:
        console.log("Have a good day!");
        process.exit();
    }
  });
}

// Functions

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

const addEmployee = () => {
  inquirer.prompt(addEmployeePrompt).then((answers) => {
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

const updateEmployee = () => {
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

const viewAllRoles = () => {
  db.query(
    "SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id",
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

const addRole = () => {
  const departmentList = [];
  db.query("SELECT * FROM department", (err, data) => {
    if (err) {
      throw err;
    } else {
      for (let index = 0; index < data.length; index++) {
        departmentList.push(data[index].id + " " + data[index].name);
      }
      inquirer
        .prompt([
          {
            type: "input",
            message: "New role title?",
            name: "newRole_title",
          },
          {
            type: "number",
            message: "what is the salary?",
            name: "newRole_salary",
          },
          {
            type: "list",
            message: "Which department uses the new role?",
            name: "departmentId",
            choices() {
              return departmentList;
            },
          },
        ])
        .then((answers) => {
          let splitter = answers.departmentId.split(' ')[0];
          db.query(
            "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)",
            [
              answers.newRole_title,
              answers.newRole_salary,
              splitter,
            ],
            (err, res) => {
              if (err) throw err;
              console.log("Successfully created role");
            }
          );
        })
        .then(() => menuPrompts());
    }
  });
};

const viewAllDepartments = () => {
  db.query("SELECT * FROM department", (err, data) => {
    if (err) {
      throw err;
    } else {
      console.table(data);
    }
    menuPrompts();
  });
};

const addDepartment = () => {
  inquirer.prompt(addDepartmentPrompt).then((answers) => {
    db.query(
      "INSERT INTO department (name) VALUES (?)",
      [answers.newDepartment],
      (err, res) => {
        if (err) throw err;
        console.log("Successfully created Department");
      }
    );
    menuPrompts();
  });
};

menuPrompts();
