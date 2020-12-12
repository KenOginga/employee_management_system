var mysql = require("mysql");
var inquirer = require("inquirer");
const { type } = require("os");
const { start } = require("repl");
const { relative } = require("path");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_db"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startPrompt();
});

let roleArray = [];
let managerArray = [];


// ============ what to do choices - either view the database, add to the database or exit the database ==============

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
            case "UPDATE":
                return updateTodo();
            default: return connection.end();
        }
    })
    .catch((err) =>{
        throw err;
    });
}

// ========== Viewing employees by role, department or both ========================
function viewTodo(){
    inquirer.prompt({
        name: "view",
        message: "What would you like to view?",
        choices: [  "View All Employees",
                    "View All Employees By Roles",
                    "View All Employees By Departments",
                    "View All Roles",
                    "View All Departments",
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
                viewDepartments();
                    break;
            case "View All Roles":
                selectAllRoles();
                    break;
            case "View All Departments":
                selectDepartmet();
                    break;
            default: connection.end();
        }
    })
}

// ==== view all employees with their roles and department ================
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
// ================= view all roles =============
function viewRoles(){
    var query = "SELECT employee.first_name, employee.last_name, roles.title AS Title FROM employee JOIN roles ON employee.role_id = roles.id;";
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table(res);
        startPrompt();
    });
}
// ======== view all departments ================
function viewDepartments(){
    var query = "SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id ORDER BY employee.id;";
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table(res);
        startPrompt();
    })
}

// ============== select all roles ==============================
function selectAllRoles(){
    connection.query("SELECT * FROM roles", function(err, res){
        if (err) throw err;
        console.table(res);
        startPrompt();
    });
}

// ========== select all departments ===================
function selectDepartmet(){
    connection.query("SELECT * FROM department", function(err, res){
        if (err) throw err;
        console.table(res);
        startPrompt();
    });
}

// =============== select all managers ==================
function selectManager() {
    connection.query("SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS name FROM employee WHERE manager_id IS NULL;", function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        managerArray.push(res[i].name);
      }
    });
    return managerArray;
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
// ============== Adding roles employees or department ========================
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
        var roleID = selectRole().indexOf(res.title) + 1;
        var managerID = selectManager().indexOf(res.manager) + 1;
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);",
        [res.first_name, res.last_name, roleID, managerID], function(err){
            if(err) throw err;
            console.table("Employee has been added......");
            startPrompt();
        });
    });
}
// ====== add more roles to the database ==========
function addRole(){
        inquirer.prompt([
            {
                name: "title",
                message: "What title would you like to add?"
            },
            {
                name: "salary",
                message: "What is the salary?"
            }
        ])
        .then(function(res){
            connection.query("INSERT INTO roles (title, salary) VALUES (?,?)", [res.title, res.salary], function(err, 
                ){
                if (err) throw err;
                console.log("Role has been added...")
                startPrompt();
            })
        });
        
        
}

// ============== add department to the database =========================
function addDepartment(){
    inquirer.prompt([
        {
            name: "name",
            message: "What department would you like to add?"
        }
    ])
    .then(function(res){
        connection.query("INSERT INTO department (name) VALUES (?)", [res.name], function(err){
            if (err) throw err;
            console.log("Department has been added....");
            startPrompt();
        })
    })
}
// ============= Updating employee ===================
function updateTodo(){
    connection.query("SELECT employee.last_name FROM employee;", function(err, res){
        if (err) throw err;
        // console.log(res)
        inquirer.prompt([
            {
                name: "last_name",
                message: "What is the employee's name?",
                type: "list",
                choices: function(){
                    var lastName = [];
                    for (var i=0; i < res.length; i++){
                       lastName.push(res[i].last_name);
                    }
                    return lastName;
                }
            },
            {
                name: "role",
                message: "What is the new role for the employee?",
                choices: selectRole(),
                type: "list"
            }
        ])
        .then(function(res){
            var roleId = selectRole().indexOf(res.role) + 1;
            connection.query("UPDATE employee SET ? WHERE id = ?;",
            [{
                last_name: res.last_name
            },
            {
                role_id: roleId
            }],
            function(err){
                if(err) throw err;
                console.log("Employee Updated....");
                startPrompt();
            })

        });
    });
}
// function deleteTodo(){
//     inquirer.prompt([
//         {
//             name: "todo",
//             message: "What would you like to remove?",
//             choices: ["Employee", "Roles", "Department", "EXIT"],
//             type: "list"
//         }
//     ])
//     .then(({todo})=>{
//         switch(todo){
//             case "Employee":
//                 return removeEmployee();
//             case "Roles":
//                 removeRole();
//                     break;
//             case "Department":
//                 return removeDepartment();
//             default: connection.end();
//         }
//     })
// }
// =============== remove role from the database ================
// function removeRole(){
//     // connection.query("SELECT title FROM roles;", function(err, res){
//     //     if (err) throw err;
//         selectRole();
//         inquirer.prompt([
//             {
//                 name: "role",
//                 message: "Which role would you like to remove?",
//                 choices: roleArray,
//                 // choices: function(){
//                 //     var roles = [];
//                 //     for (var i=0; i < res.length; i++){
//                 //        roles.push(res.role);
//                 //     }
//                 //     return roles;
//                 // },
//                 type: "list"
//             }
//         ])
//         .then(function(res){
//             var roleId = selectRole().indexOf(res.role) + 1;
//             connection.query("DELETE FROM roles WHERE id = ?;", [roleId], function(err){
//                 if (err) throw err;
//                 console.log("Role has been deleted");
//                 startPrompt();
//             })
//         })
//     // })
    
// }