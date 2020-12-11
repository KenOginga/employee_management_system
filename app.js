var mysql = require("mysql");
var inquirer = require("inquirer");
const { type } = require("os");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "your password",
    database: "employee_db"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startPrompt();
});

let roleArray = [];
let managerArray = [];

function startPrompt(){
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
                return addTodo();
            case "DELETE":
                return deleteTodo();
            case "UPDATE":
                return updateTodo();
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
        choices: [  "View All Employees",
                    "View All Employees By Roles",
                    "View All Employees By Departments",
                    // "Add Employee",
                    // "Update Employee",
                    // "Remove Employee",
                    // "Add Role",
                    // "Remove Role",
                    // "Add Department",
                    // "Remove Department",
                    "EXIT"
                ],
        type: "list"
    })
    .then(({view}) => {
        switch(view){
            case "View All Employees":
                viewAllEmployees();
                    break;
            case "View All Employees By Roles":
                viewRoles();
                    break;
            case "View All Employees By Departments":
                return viewDepartments();
        }
    })
}
function viewAllEmployees(){
    var query = "SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.name AS department, CONCAT(e.first_name, ' ', e.last_name) AS Manager "
    query += "FROM employee INNER JOIN roles ON roles.id = employee.role_id "
    query += "INNER JOIN department ON department.id = roles.department_id LEFT JOIN employee e ON employee.manager_id = e.id;";
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table(res);
        startPrompt();
    })
}
function viewRoles(){
    var query = "SELECT employee.first_name, employee.last_name, roles.title AS Title FROM employee JOIN roles ON employee.role_id = roles.id;";
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table(res);
        startPrompt();
    });
}
function viewDepartments(){
    var query = "SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id ORDER BY employee.id;";
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table(res);
        startPrompt();
    })
}

function selectRole() {
    connection.query("SELECT * FROM roles", function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        roleArray.push(res[i].title);
      }
  
    });
    
    return roleArray;
}

function selectManager() {
    connection.query("SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS name FROM employee;", function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        managerArray.push(res[i].name);
      }
  
    });
   
    return managerArray;
}

function addTodo(){
    inquirer.prompt({
        name: "add",
        message: "What would you like to add?",
        choices: [  "Add Employee",
                    "Add Role",
                    "Add Department",
                    "EXIT"
                ],
        type: "list"
    })
    .then(({add}) => {
        switch(add){
            case "Add Employee":
                addEmployee();
                    break;
            case "Add Role":
                addRole();
                    break;
            case "Add Department":
                addDepartment();
                    break;
            default: return connection.end();
        }
    })
}
function addEmployee(){
    inquirer.prompt([
        {
            name: "first_name",
            message: "Enter the first name"
        },
        {
            name: "last_name",
            message: "Enter the last name"
        },
        {
            name: "title",
            message: "What is their title?",
            choices: selectRole(),
            type: "list"
        },
        {
            name: "manager",
            message: "What is their manager's name?",
            choices: selectManager(),
            type: "list"
        }
    ])
    .then((res) => {
        var roleID = selectRole().indexOf(res.role) + 1;
        var managerID = selectManager().indexOf(res.manager) + 1;
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);",
        [res.first_name, res.last_name, roleID, managerID], function(err){
            if(err) throw err;
            console.table(res);
            startPrompt();
        })
    });
}
