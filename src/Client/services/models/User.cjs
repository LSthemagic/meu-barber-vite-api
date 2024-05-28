const mongoose = require("../../../shared/services/database/index.cjs");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		lowercase: true,
		required: true
	},
	password: {
		type: String,
		select: false
		// para não mostrar a senha
	},
	createAt: {
		type: Date,
		default: Date.now
	},
	babershopFavorites: [
		{
			type: String
		}
	]
});

UserSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password') || user.isNew) {
		try {
			if (!user.password) {
				throw new Error('Password is required');
			}
			const hash = await bcrypt.hash(this.password, 10);
			this.password = hash;
			next();
		} catch (error) {
			next(error);
		}
	} else {
		next();
	}
});


const User = mongoose.model("Clients", UserSchema);
module.exports = User;
