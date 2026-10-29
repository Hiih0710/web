const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

// Change these if your MySQL settings are different.
const dbSettings = {
    host: 'localhost',
    user: 'root',
    password: ''
};

let db;

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (character) {
        const characters = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return characters[character];
    });
}

function makePage(students, editingStudent, message) {
    let studentRows = '';

    for (const student of students) {
        studentRows += `
            <tr>
                <td>${escapeHtml(student.name)}</td>
                <td>${escapeHtml(student.email)}</td>
                <td>${escapeHtml(student.course)}</td>
                <td>
                    <a href="/edit/${student.id}">Edit</a>
                    <form class="delete-form" action="/delete/${student.id}" method="post" onsubmit="return confirm('Delete this student?')">
                        <button class="delete-button" type="submit">Delete</button>
                    </form>
                </td>
            </tr>`;
    }

    if (studentRows === '') {
        studentRows = '<tr><td colspan="4">No students added yet.</td></tr>';
    }

    let formAction = '/add';
    let buttonText = 'Add Student';
    let formTitle = 'Add Student';
    let name = '';
    let email = '';
    let course = '';

    if (editingStudent) {
        formAction = '/update/' + editingStudent.id;
        buttonText = 'Update Student';
        formTitle = 'Edit Student';
        name = escapeHtml(editingStudent.name);
        email = escapeHtml(editingStudent.email);
        course = escapeHtml(editingStudent.course);
    }

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student CRUD</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f2f2f2; margin: 20px; }
            .container { max-width: 800px; margin: auto; }
            .box { background: white; padding: 20px; margin-bottom: 20px; }
            input { display: block; width: 100%; padding: 8px; margin: 6px 0 12px; box-sizing: border-box; }
            button { padding: 8px 12px; background: #2878c7; color: white; border: 0; cursor: pointer; }
            table { width: 100%; border-collapse: collapse; background: white; }
            th, td { padding: 10px; border: 1px solid #ccc; text-align: left; }
            th { background: #e8e8e8; }
            .delete-form { display: inline; }
            .delete-button { background: #c0392b; }
            .message { color: green; }
            a { margin-right: 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Student Records</h1>
            <p>Basic CRUD using Node.js, Express.js and MySQL</p>
            ${message ? `<p class="message">${escapeHtml(message)}</p>` : ''}

            <div class="box">
                <h2>${formTitle}</h2>
                <form action="${formAction}" method="post">
                    <label>Name</label>
                    <input type="text" name="name" value="${name}" required>
                    <label>Email</label>
                    <input type="email" name="email" value="${email}" required>
                    <label>Course</label>
                    <input type="text" name="course" value="${course}" required>
                    <button type="submit">${buttonText}</button>
                    ${editingStudent ? '<a href="/">Cancel</a>' : ''}
                </form>
            </div>

            <div class="box">
                <h2>Student List</h2>
                <table>
                    <tr><th>Name</th><th>Email</th><th>Course</th><th>Actions</th></tr>
                    ${studentRows}
                </table>
            </div>
        </div>
    </body>
    </html>`;
}

app.get('/', async (req, res) => {
    try {
        const [students] = await db.query('SELECT * FROM students ORDER BY id DESC');
        const messages = {
            added: 'Student added successfully.',
            updated: 'Student updated successfully.',
            deleted: 'Student deleted successfully.',
            invalid: 'Please fill in all fields with a valid email.'
        };
        res.send(makePage(students, null, messages[req.query.message] || messages[req.query.error] || ''));
    } catch (error) {
        res.status(500).send('Could not load students. Check that MySQL is running.');
    }
});

app.post('/add', async (req, res) => {
    const { name, email, course } = req.body;

    if (!name || !email || !email.includes('@') || !course) {
        return res.redirect('/?error=invalid');
    }

    try {
        await db.query('INSERT INTO students (name, email, course) VALUES (?, ?, ?)', [name, email, course]);
        res.redirect('/?message=added');
    } catch (error) {
        res.status(500).send('Could not add student.');
    }
});

app.get('/edit/:id', async (req, res) => {
    try {
        const [students] = await db.query('SELECT * FROM students ORDER BY id DESC');
        const [rows] = await db.query('SELECT * FROM students WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.redirect('/');
        }

        res.send(makePage(students, rows[0], ''));
    } catch (error) {
        res.status(500).send('Could not open student record.');
    }
});

app.post('/update/:id', async (req, res) => {
    const { name, email, course } = req.body;

    if (!name || !email || !email.includes('@') || !course) {
        return res.redirect('/?error=invalid');
    }

    try {
        await db.query(
            'UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?',
            [name, email, course, req.params.id]
        );
        res.redirect('/?message=updated');
    } catch (error) {
        res.status(500).send('Could not update student.');
    }
});

app.post('/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
        res.redirect('/?message=deleted');
    } catch (error) {
        res.status(500).send('Could not delete student.');
    }
});

async function startServer() {
    try {
        // Create the database first, then connect to it.
        const connection = await mysql.createConnection(dbSettings);
        await connection.query('CREATE DATABASE IF NOT EXISTS student_crud_db');
        await connection.end();

        db = mysql.createPool({
            ...dbSettings,
            database: 'student_crud_db'
        });

        await db.query(`CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(190) NOT NULL,
            course VARCHAR(100) NOT NULL
        )`);

        app.listen(port, () => {
            console.log('App is running at http://localhost:' + port);
        });
    } catch (error) {
        console.log('Could not connect to MySQL. Start MySQL in XAMPP and check the settings in server.js.');
    }
}

startServer();
