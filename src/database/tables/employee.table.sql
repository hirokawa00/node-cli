CREATE TABLE employee (
    employee_id INT, -- 従業員ID
    department_id INT, -- 部門ID
    first_name NVARCHAR(100), -- 名
    last_name NVARCHAR(100), -- 姓
    start_date DATE,   -- カラム論理名: 入社日
    CONSTRAINT pk_employee PRIMARY KEY (employee_id, department_id)     -- テーブル論理名: 従業員情報
);

CREATE INDEX idx_employee_name ON employee (first_name, last_name);
