-- Creating our database ---
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

-- Department table ---
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

-- Employee Role table ---
CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Employee table ---
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- Department Seeds --
INSERT INTO department (name)
VALUES ("Engineering"),("Sales"),("administration"),("Finance");

-- DEPARTMENT SEEDS -----
INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("Finance");
INSERT INTO department (name)
VALUE ("Legal");

-- EMPLOYEE ROLE SEEDS -------
INSERT INTO roles (title, salary, department_id)
VALUE ("Lead Engineer", 150000, 2);
INSERT INTO roles (title, salary, department_id)
VALUE ("Legal Team Lead", 250000, 4);
INSERT INTO roles (title, salary, department_id)
VALUE ("Accountant", 125000, 3);
INSERT INTO roles (title, salary, department_id)
VALUE ("Sales Lead", 100000, 1);
INSERT INTO roles (title, salary, department_id)
VALUE ("Salesperson", 80000, 1);
INSERT INTO roles (title, salary, department_id)
VALUE ("Software Engineer", 120000, 2);
INSERT INTO roles (title, salary, department_id)
VALUE ("Lawyer", 190000, 4);

-- EMPLOYEE SEEDS -------
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Jessica", "Haze", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Tiffany", "Patric", null, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Mia","Lam",null,3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Bently", "Lao", 1, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Chris", "Melby", 4, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Jason", "Baker", 1, 6);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Tom", "Nice", 2, 7);

-- Selecting to populate the tables
SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;

SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.name, CONCAT(e.first_name, ' ', e.last_name) AS Manager
FROM employee
INNER JOIN roles ON roles.id = employee.role_id
INNER JOIN department ON department.id = roles.department_id
LEFT JOIN employee e ON employee.manager_id = e.id;







