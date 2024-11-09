const { profile_exists, create_profile } = require("../controller/profile")

const router = require("express").Router()

router.post("/exists", profile_exists)
router.post("/create", create_profile)

module.exports = router