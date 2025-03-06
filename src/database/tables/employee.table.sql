CREATE TABLE employee (
    employee_id INT,
    department_id INT,
    first_name NVARCHAR(100),
    last_name NVARCHAR(100),
    start_date DATE,
    CONSTRAINT pk_employee PRIMARY KEY (employee_id, department_id)
);

CREATE INDEX idx_employee_name ON employee (first_name, last_name);
