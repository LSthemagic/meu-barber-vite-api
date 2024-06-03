module.exports = (req, res, next) => {
	const jwt = require("jsonwebtoken");
	console.log("middleware");
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({
			error: true,
			message: "Token no provided."
		});
	}
	// formato de token jwt 
	//Bearer token
	const parts = authHeader.split(" ");
	if (parts.length !== 2) {
		return res.status(401).json({
			error: true,
			message: "Invalid Token Type."
		});
	}
	const [scheme, token] = parts;
	if ((scheme.indexOf("Bearer") !== 0) == true) {
		return res.status(401).json({
			error: true,
			message: "Token malformed."
		});
	}

	return jwt.verify(token, process.env.REACT_APP_SECRET, (err, decoded) => {
		if (err) {
			console.log("Error em verify authenticate middleware user => \n", err.message);
			return res.status(401).json({
				error: true,
				message: "Token invalid or expired."
			});
		}
		req.userLogged = decoded;
		console.log("decoded => \n", decoded);
		return next();
	});
};
