INSERT INTO department (id, name)
VALUES (001, "Sales Lead"),
       (002, "Legal Team Lead"),
       (003, "Lead Engineer"),
       (004, "Account Manager")

       
INSERT INTO role (id, title, salary, department_id)
VALUES (001, "Sales Lead", 100000, "Sales"),
       (002, "Salesperson", 80000, "Sales"),
       (003, "Lead Engineer", 150000, "Engineering"),
       (004, "Software Engineer", 120000, "Engineering"),
       (005, "Account Manager", 160000, "Finance"),
       (006, "Accountant", 125000, "Finance"),
       (007, "Legal Team Lead", 250000, "Legal"),
       (008, "Lawyer", 190000, "Legal"),


INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (001, "John", "Doe", "Sales Lead", null),
       (002, "Mike", "Chan", "Salesperson", "John Doe"),
       (003, "Ashley", "Rodriguez", "Lead Engineer", null),
       (004, "Kevin", "Tupik", "Software Engineer", "Ashley Rodriguez"),
       (005, "Kunal", "Singh", "Account Manager", null),
       (006, "Malia", "Brown", "Accountant", "Kunal Singh"),
       (007, "Sarah", "Lourd", "Legal Team Lead", null),
       (008, "Tom", "Allen", "Lawyer", "Sarah Lourd");

