const db = require("../db")

async function create_project(req, res) {
    try {
        if (!req.body) throw Error("Network Error")
        const { owner, project_data, verified } = req.body
        console.log(JSON.stringify(project_data))
        const query = await db.query(
            `INSERT INTO projects (owner, project_data, verified) VALUES($1, $2, $3)`,
            [owner, project_data, verified]
        );
        res.send({
            success: true
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
    create_project
}