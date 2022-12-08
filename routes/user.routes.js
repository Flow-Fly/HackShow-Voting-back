const router = require("express").Router()
const User = require("./../models/User.model")
const axios = require("axios")

router.get("/", async (req, res, next) => {
	try {
		const { name } = req.query
		const users = await User.find(
			{
				username: { $regex: name, $options: "i" },
			},
			{ username: 1, photo: 1 }
		).limit(5)

		res.status(200).json(users)
	} catch (error) {
		next(error)
	}
})
router.get("/votes", async (req, res, next) => {
	try {
		const { name } = req.query
		const user = await User.findOne(
			{
				username: { $regex: name, $options: "i" },
				votes: { $size: 0 },
			},
			{ username: 1, votes: 1 }
		)
		if (!user) {
			throw Error("You already voted.")
		}
		if (user.username === name) {
			res.status(200).json({ message: "Success." })
		} else {
			throw Error("Wrong username.")
		}
	} catch (error) {
		next(error)
	}
})

module.exports = router
