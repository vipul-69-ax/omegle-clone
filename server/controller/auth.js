const db = require("../db");
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");
const { SECRET_TOKEN_KEY } = require("../global");
async function signup(req, res) {
    try {
        if (!req.body) throw Error("Network Error")
        const { email, password } = req.body
        const existing_users = await db.query(`SELECT * from users WHERE email = '${email}'`)
        if (existing_users.rowCount === 0) {
            const hashedPassword = await argon2.hash(password)
            const token = jwt.sign(
                {
                    email,
                    hashedPassword
                },
                SECRET_TOKEN_KEY
            );
            await db.query(`INSERT INTO users(token, email, password) VALUES('${token}', '${email}', '${hashedPassword}')`)
            res.send({
                success: true,
                token
            })
        } else {
            throw Error("An account already exists. Please login.")
        }
    }
    catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
}

async function login(req, res) {
    try {
        if (!req.body) throw Error("Network error")
        const { email, password } = req.body
        const user = await db.query(`SELECT token, password from users WHERE email = '${email}'`)
        if (user.rowCount === 0) throw Error("No user exists with email.")
        const user_data = user.rows[0]
        const matchPassword = await argon2.verify(user_data.password, password)
        if(!matchPassword) throw Error("Password mismatch")
        if (matchPassword) {
            res.send({
                success: true,
                token: user_data.token
            })
        }
    }
    catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
}

module.exports = { signup, login }