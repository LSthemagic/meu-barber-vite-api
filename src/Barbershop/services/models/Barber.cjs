const mongoose = require("../../../shared/services/database/index.cjs");
const bcrypt = require("bcryptjs");

const ServicesSchema = new mongoose.Schema({
	nameService: {
		type: String,
		required: true
	},
	price: {
		type: String,
		required: true
	},
	duration: {
		type: String
	}
})

const PictureSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	src: {
		type: String,
		required: true
	}
})

const ClienteSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		sparse: true, // Permite valores nulos e únicos
		lowercase: true,
		unique: true
	},
	startDate: {
		type: Date
	},
	endDate: {
		type: Date
	},
	service_id: {
		type: String,
	},

});

const UnavailableDateSchema = new mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		sparse: true
	},
	startDate: {
		type: Date
	},
	endDate: {
		type: Date
	},
	type: {
		type: String
	},
	name: {
		type: String
	},
	service_id: {
		type: String,
	}
});

const BarberSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		lowercase: true
	},
	unavailableDate: [UnavailableDateSchema], // Array of dates
	clients: {
		type: [ClienteSchema],
		default: [] // Initialize as an empty array
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});


const EstablishmentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
	},
	password: {
		type: String,
		select: false
	},
	picture: {
		type: [PictureSchema],
		default: []
	},
	barbers: {
		type: [BarberSchema],
		default: [],
	},
	services: {
		type: [ServicesSchema],
		default: [],
	},
	location: {
		latitude: {
			type: String,
			required: true
		},
		longitude: {
			type: String,
			required: true
		}
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

EstablishmentSchema.pre('save', async function (next) {
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

const Barber = mongoose.model("Barbershop", EstablishmentSchema);

module.exports = Barber;
