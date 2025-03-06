CREATE TABLE Employees (
    ID INT NOT NULL PRIMARY KEY, -- 連番ID
    EmployeeID INT NOT NULL, -- 社員ID
    FirstName NVARCHAR(50) NULL DEFAULT 'Unknown', -- 名
    LastName NVARCHAR(50) NOT NULL, -- 姓
    BirthDate DATE NULL DEFAULT GETDATE() -- 生年月日
);