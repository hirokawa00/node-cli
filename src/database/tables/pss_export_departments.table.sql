CREATE TABLE pss_export_departments (
    department_code VARCHAR(10) PRIMARY KEY,
    department_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(255),
    start_date DATE DEFAULT GETDATE(),
    end_date DATE,
    is_target_for_pss BIT NOT NULL DEFAULT 0
);
