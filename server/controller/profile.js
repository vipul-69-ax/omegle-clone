const db = require("../db")
const { authenticate_token } = require("../global")

async function profile_exists(req, res) {
    try {
        if (!req.body || !req.headers) throw Error("Network Error")
        if (!authenticate_token(req)) throw Error("Try signing in again")
        const { token } = req.body
        const query = await db.query(`SELECT * FROM profile WHERE token='${token}'`)
        if (query.rowCount === 1) {
            res.send({
                success: true,
            })
        }
        else {
            throw Error("Profile does not exist.")
        }
    }
    catch (err) {
        res.send({
            success: false,
            error: err.message
        })
    }
}

async function create_profile(req, res) {
    try {
        if (!req.body || !req.headers) throw Error("Network Error")
        if (!authenticate_token(req)) throw Error("Try signing in again")
        const { bio, studying, interests, university, role, name } = req.body
        const token = req.headers.authorization.split(" ")[1]
        const is_existing = await db.query(`SELECT * FROM profile WHERE token='${token}'`)
        console.log(token)
        if (is_existing.rowCount === 1) {

        }
        else {
            await db.query(
                `INSERT INTO profile (token, bio, studying, interests, university, role, username)
                 SELECT u.token, 
                        $1,            -- bio
                        $2,            -- studying
                        $3,            -- interests
                        $4,            -- university
                        $5,             -- role
                        $7             -- username
                 FROM users u
                 WHERE u.token = $6`,
                [
                    bio,
                    studying,
                    interests,
                    university,
                    role,
                    token,
                    name
                ]
            );
            res.send({
                success: true,
                message: "Profile Created!"
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

module.exports = {
    profile_exists,
    create_profile
}

