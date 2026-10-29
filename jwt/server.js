
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

const SECRET_KEY = "my_secret_key";
let users = [];

// REGISTER
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        username,
        password: hashedPassword
    });

    res.json({
        message: "User registered successfully"
    });
});

// LOGIN
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const validPassword = await bcrypt.compare(
        password,
        user.password
    );

    if (!validPassword) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const token = jwt.sign(
        { username: user.username },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    res.json({
        message: "Login successful",
        token: token
    });
});

// JWT MIDDLEWARE
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid or expired token"
            });
        }

        req.user = user;
        next();
    });
}

// PROTECTED ROUTE
app.get("/profile", authenticateToken, (req, res) => {
    res.json({
        message: "Welcome to your profile",
        username: req.user.username
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
