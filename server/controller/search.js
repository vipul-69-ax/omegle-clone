const db = require("../db")

function formatTsQueryInput(userInput) {
    const trimmedInput = userInput.trim();

    const formattedTerms = trimmedInput
        .split(/\s+/)
        .map(term => `${term}:*`);

    return formattedTerms.join(' & ');
}

async function search_user(req, res) {
    try {
        if (!req.body) throw Error("Network Error")
        const { searchQuery } = req.body
        const users = await db.query(`SELECT * FROM profile WHERE username @@ to_tsquery('english', '${formatTsQueryInput(searchQuery)}') LIMIT 5;`)
        console.log(users.rowCount)
        if (users.rowCount === 0) {
            res.send({
                success: true,
                data: []
            })
            return
        }
        const data = users.rows.map(i => {
            return {
                name: i.username,
                role: i.role,
                university: i.university,
                studying: i.studying,
                id: i.token
            }
        })
        res.send({
            success: true,
            data
        })
    }
    catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
}

module.exports = {
    search_user
}