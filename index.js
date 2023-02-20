const inquirer = require("inquirer");
const cTable = require("console.table");

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

async function menuPrompts() {
  let exit = false;
  do {
    let answers = await inquirer.prompt(startMenu);
    exit = answers.initialChoice === "Quit" ? true : false;
  } while (!exit);
}

menuPrompts();
