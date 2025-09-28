# SQL Interview Questions

## Queries

### 1. What is a JOIN in SQL?
**Answer:**
A JOIN clause is used to combine rows from two or more tables, based on a related column.

**Example:**
```sql
SELECT employees.name, departments.dept_name
FROM employees
JOIN departments ON employees.dept_id = departments.id;
```

## Optimization

### 1. How do you optimize SQL queries?
**Answer:**
- Use indexes
- Avoid SELECT *
- Use proper WHERE clauses
- Limit result set
