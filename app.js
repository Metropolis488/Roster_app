const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

var roster = [];

addManager()
async function addManager() {
    const {name, id, email, officeNumber, additional} = await inquirer.prompt([
        {
            message: "What is the manager's name?",
            name: "name"
        },
        {
            message: "What is the manager's ID?",
            name: "id"
        },
        {
            message: "What is the manager's email address?",
            name: "email"
        },
        {
            message: "What is the manager's office number?",
            name: "officeNumber"
        },
        {
            type: "list",
            message: "Would you like add more team members?",
            name: "additional",
            choices: ["Yes", new inquirer.Separator(), "No"]
        }
    ])
    roster.push(new Manager(name, id, email, officeNumber));
    console.log(roster);
    
    switch (additional) {
        case "Yes": return addEmployee();
        case "No": return createFile();
    }
}

async function addEmployee() {
    const {name, id, email, additional} = await inquirer.prompt([
        {
            message: "What is the employee's name?",
            name: "name"
        },
        {
            message: "What is the employee's ID?",
            name: "id"
        },
        {
            message: "What is the employee's email address?",
            name: "email" 
        },
        {
            type: "list",
            message: "Is this employee an engineer or intern?",
            name: "additional",
            choices: ["Engineer", new inquirer.Separator(), "Intern"]
        }
    ])
    switch (additional) {
        case "Engineer": return addEngineer(name, id, email);
        case "Intern": return addIntern(name, id, email);
    }
}

async function addEngineer(name, id, email) {
    const {github, addMore} = await inquirer.prompt([
            {
                message: "What is the employee's github account?",
                name: "github"
            },
            {
                type: "list",
                message: "Would you like to add another employee?",
                name: "addMore",
                choices: ["Yes", new inquirer.Separator(), "No"]
            }
        ]);
        roster.push(new Engineer(name, id, email, github));
        console.log(roster);
        switch(addMore) {
            case "Yes": addEmployee();
            case "No": return createFile();
        }
    }

async function addIntern(name, id, email) {
    const {school, addMore} = await inquirer.prompt([
        {
            message: "What is the employee's school?",
            name: "school"
        },
        {
            type: "list",
            message: "Would you like to add another employee?",
            name: "addMore",
            choices: ["Yes", new inquirer.Separator(), "No"]
        }
    ]);
    roster.push(new Intern(name, id, email, school));
    console.log(roster);
    switch(addMore) {
        case "Yes": addEmployee();
        case "No": return createFile();
    };
};

async function createFile() {
    const finalPage = await render(roster);
    await fs.writeFile(outputPath, finalPage, () => {});
};

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
