const { Schema, model } = require("mongoose")

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
	{
		username: String,
		photo: String,
		votes: [
			{
				type: Schema.Types.ObjectId,
				ref: "Project",
				validate: [validateThreeProjects, "Too many votes."],
			},
		],
	},
	{
		// this second object adds extra properties: `createdAt` and `updatedAt`
		timestamps: true,
	}
)

function validateThreeProjects(arr) {
	return arr.length < 4
}

const User = model("User", userSchema)

module.exports = User
