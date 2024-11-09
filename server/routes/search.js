const { search_user } = require("../controller/search")

const router = require("express").Router()

router.post("/users", search_user)

module.exports = router