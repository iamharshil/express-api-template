const RESPONSE = {
	success: (res, message = "Success", data = null) => {
		return res.status(200).json({
			success: true,
			code: 200,
			message,
			data,
		});
	},
	error: (res, message = "Error", data = null) => {
		return res.status(500).json({
			success: false,
			code: 500,
			message,
			data,
		});
	},
	authError: (res, message = "Authentication Error", data = null) => {
		return res.status(401).json({
			success: false,
			code: 401,
			message,
			data,
		});
	},
	validationError: (res, message = "Validation Error", data = null) => {
		return res.status(422).json({
			success: false,
			code: 422,
			message,
			data,
		});
	},

	// non -response helpers
	successData: (data = null, message = "Success") => {
		return {
			success: true,
			code: 200,
			message,
			data,
		};
	},
	errorData: (message = "Error", data = null) => {
		return {
			success: false,
			code: 500,
			message,
			data,
		};
	},
};

export default RESPONSE;
