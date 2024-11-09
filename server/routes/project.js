const { create_project } = require("../controller/project")

const router = require("express").Router()

router.post("/create", create_project)

module.exports = router