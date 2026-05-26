const db = require("../db");

const register = (req, res) => {

    const { name, email, password, role } = req.body;

    const sql = `
        INSERT INTO users(name, email, password, role)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [name, email, password, role], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "User created"
        });
    });
};

const login = (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT * FROM users
        WHERE email = ?
        AND password = ?
    `;

    db.query(sql, [email, password], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        res.json(result[0]);
    });
};

module.exports = {
    register,
    login
};