const db = require("../db");

const login = (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
        AND password = ?
    `;

    db.query(
        sql,
        [email, password],

        (err, result) => {

            if (err) {

                return res.status(500).json(err);
            }

            if (result.length === 0) {

                return res.status(401).json({
                    message: "Invalid credentials"
                });
            }

            const user = result[0];

            // DETERMINE DEPARTMENT FROM EMAIL

            let department = "";

            if (
                user.email === "it@company.com"
            ) {
                department = "IT";
            }

            else if (
                user.email === "hr@company.com"
            ) {
                department = "HR";
            }

            else if (
                user.email === "network@company.com"
            ) {
                department = "NETWORK";
            }

            res.json({

                id: user.id,

                name: user.name,

                email: user.email,

                role: user.role,

                department
            });
        }
    );
};

module.exports = {
    login
};