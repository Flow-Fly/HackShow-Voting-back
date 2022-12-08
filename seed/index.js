require("dotenv").config("../")
require("../db/index")
const axios = require("axios")
const User = require("../models/User.model")
const Project = require("./../models/Project.model")

const students = require("./students.json")

;(async function () {
	await seedUsers()
	console.log("Created students")
	await seedProjects()
	console.log("Created projects\nDone.")
	process.exit()
})()

async function seedUsers() {
	await User.deleteMany()
	for await (const student of students) {
		try {
			const { data } = await axios.get(
				`https://api.github.com/users/${student.github.username}`
			)
			student.photo = data.avatar_url
		} catch (error) {
			console.log(error.message, student.name)
		}
	}
	console.log(students)
	const allStudents = students.map((student) => {
		return User.create({
			username: student.github.username,
			photo: student.photo,
		})
	})
	await Promise.all(allStudents)
	console.log(allStudents)
}

const projects = [
	{
		name: "BandGram",
		collaborators: ["maurinecornillon"],
	},
	{
		name: "Octopus",
		collaborators: ["LucileTech", "amelichab"],
	},
	{
		name: "Hook",
		collaborators: ["jsarzi", "olxmpe", "samsinz"],
	},
	{
		name: "WhereIsMyFreddie",
		collaborators: ["cpnsn", "VitchetUK"],
	},
	{
		name: "Evently-2.0",
		collaborators: ["yaseminsabeva", "Sshaker2", "Janittto"],
	},
	{
		name: "Alexandria",
		collaborators: ["guilhem1492", "chamsdinn"],
	},
	{
		name: "Neighbourly",
		collaborators: ["bapturp", "anthobab"],
	},
	{
		name: "WhyHeadHurt",
		collaborators: ["hugoviolas", "inesza"],
	},
	{
		name: "RentMyCar",
		collaborators: ["Ole-the-blonde"],
	},
	{
		name: "CiaoTube",
		collaborators: ["leogenuit"],
	},
]

async function seedProjects() {
	await Project.deleteMany()
	for (const project of projects) {
		const collaboratorsId = await getCollaboratorsId(project.collaborators)
		console.log({ collaboratorsId, name: project.name })
		const update = project.collaborators.map((elem, i) => collaboratorsId[i].id)
		project.collaborators = update
		await Project.create(project)
	}
}

async function getCollaboratorsId(arr) {
	const promises = arr.map((p) =>
		User.findOne({ username: { $regex: p, $options: "i" } })
	)
	return await Promise.all(promises)
}
