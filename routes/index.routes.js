const router = require("express").Router()

router.get("/", (req, res, next) => {
	res.json("All good in here")
})

router.use("/user", require("./user.routes"))
router.use("/projects", require("./projects.routes"))

module.exports = router
