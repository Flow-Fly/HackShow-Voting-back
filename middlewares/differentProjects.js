const projectsAreDifferent = (req, res, next) => {
	const { votes } = req.body
	if ([...new Set(votes)].length === 3) {
		req.votes = votes
		req.user = req.body.id
		return next()
	}
	res.status(403).json({ message: "I'm watching!" })
}
module.exports = projectsAreDifferent
