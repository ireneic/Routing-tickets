const db = require("../db");

const axios = require("axios");

const createTicket = async (req, res) => {

    const {
        title,
        description,
        priority,
        department,
        created_by,
        recipientEmail
    } = req.body;

    let assigned_to = null;

    // AUTO ROUTING

    if (department === "IT") {
        assigned_to = 1;
    }

    else if (department === "HR") {
        assigned_to = 2;
    }

    else if (department === "NETWORK") {
        assigned_to = 3;
    }

    const sql = `
        INSERT INTO tickets
        (
            title,
            description,
            priority,
            department,
            assigned_to,
            created_by
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            title,
            description,
            priority,
            department,
            assigned_to,
            created_by
        ],

        async (err, result) => {

            if (err) {

                return res.status(500).json(err);
            }

            try {

                await axios.post(
                    "https://stefania26017.app.n8n.cloud/webhook-test/send-ticket",
                    {
                        title,
                        description,
                        priority,
                        department,
                        recipientEmail
                    }
                );

            } catch (emailError) {

                console.log(emailError);
            }

            res.json({
                message: "Ticket created successfully"
            });
        }
    );
};

const getTickets = (req, res) => {

    const sql = `
        SELECT
            tickets.*,
            users.name AS assigned_agent
        FROM tickets
        LEFT JOIN users
        ON tickets.assigned_to = users.id
    `;

    db.query(sql, (err, result) => {

        if (err) {

            return res.status(500).json(err);
        }

        res.json(result);
    });
};

module.exports = {
    createTicket,
    getTickets
};