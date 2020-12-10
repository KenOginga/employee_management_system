var mysql = require("mysql");
var inquirer = require("inquirer");
const { type } = require("os");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Miocene235@#%",
    database: "top_songs_db"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    init();
});

function init(){
    inquirer.prompt({
        name: "todo",
        message: "What would you like to do?",
        choices: ["VIEW", "ADD", "UPDATE", "EXIT"],
        type: "list",

    })
    .then(({todo}) => {
        switch (todo){
            case "VIEW":
                return viewTodo();
                
            case "ADD":
                return addEmployees();

            default: return connection.end();
        }
    })
    .catch((err) =>{
        throw err;
    });
}

function viewTodo(){
    inquirer.prompt({
        name: "view",
        message: "What would you like to view?",
        choices: ["View All Employees", "View Roles", "View Departments"],
        type: "list"
    })
    .then(({view}) => {
        switch(view){
            case "View All Employees":
                return viewEmployees();
            case "View Roles":
                return viewRoles();
            case "View Departments":
                return viewDepartments();
        }
    })
}
function viewEmployees(){
    connection.query(`SELECT * FROM employee`, )
}