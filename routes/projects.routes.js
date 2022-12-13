const router = require("express").Router()
const Project = require("./../models/Project.model")
const Projects = require("./../models/Project.model")
const projectsAreDifferent = require("./../middlewares/differentProjects")
const User = require("../models/User.model")

router.get("/", async (req, res, next) => {
	const { user, vote } = req.query
	try {
		const projects = await Projects.find({
			_id: { $nin: vote },
			collaborators: { $ne: user },
		})

		res.status(200).json(projects)
	} catch (error) {
		next(error)
	}
})

router.get("/validate", async (req, res, next) => {
	try {
		const { vote } = req.query
		const out = await Promise.all(vote.map((id) => Project.findById(id)))
		// const projects = await Project.find({ _id: { $in: vote } })
		res.status(200).json(out)
	} catch (error) {
		next(error)
	}
})

router.post("/", projectsAreDifferent, async (req, res, next) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.user,
			{ votes: req.votes },
			{
				new: true,
			}
		)
		res.status(200).json(updatedUser)
	} catch (error) {
		next(error)
	}
})

module.exports = router
