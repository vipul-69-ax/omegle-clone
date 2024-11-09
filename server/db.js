const { Pool } = require("pg")

const db = new Pool({
    user: "postgres",
    password: "vipu2004",
    database: "project",
    host: "localhost",
    port: 5432
})

module.exports = db