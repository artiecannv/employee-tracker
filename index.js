const inquirer = require("inquirer");
const cTable = require("console.table");
const { viewEmployees } = require("./utils/utilities");

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
    console.info("testing");
    console.info(answers);
    // if (answers.initialChoice === "View All Employees") {
    //   await viewEmployees();
    // }
    exit = answers.initialChoice === "Quit" ? true : false;
  } while (!exit);
}

menuPrompts();
