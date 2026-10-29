create database college;
USE college;
CREATE TABLE students (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
course VARCHAR(50),
mobile VARCHAR(15)
);
INSERT INTO students (name, course, mobile) VALUES
('Rahul Sharma', 'BCA', '9876543210'),
('Priya Patil', 'BCA', '9876543211'),
('Amit Singh', 'MCA', '9876543212');