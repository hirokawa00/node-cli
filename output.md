# テーブル定義一覧

## employee

| カラム名              | データ型       | 制約                 |
|----------------------|-------------|----------------------|
| employee_id | INT |  |
| department_id | INT |  |
| first_name | NVARCHAR(100) |  |
| last_name | NVARCHAR(100) |  |
| start_date | DATE |  |

### 複合プライマリキー
| カラム名         | 制約       |
|-----------------|-----------|
| employee_id, department_id | PRIMARY KEY |


## pss_export_departments

| カラム名              | データ型       | 制約                 |
|----------------------|-------------|----------------------|
| department_code | VARCHAR(10) | PRIMARY KEY |
| department_name | NVARCHAR(100) | NOT NULL |
| description | NVARCHAR(255) |  |
| start_date | DATE | DEFAULT GETDATE() |
| end_date | DATE |  |
| is_target_for_pss | BIT | NOT NULL, DEFAULT 0 |


