const express        = require("express");
const passport		 = require("passport");
const router		 = express.Router();
const bcrypt         = require("bcrypt");
const multer		 = require('multer');
const User			 = require("../../models/user");
const cloudinary	 = require("cloudinary");

let upload = multer({
	dest: './public/images/profiles'
})

router.post("/", upload.single('file'), (req, res, next) => {
	if (!req.user) {
		return res.status(500).json({ message: 'Not logged' });
	}
	if (!req.body.username || !req.body.password || !req.body.email || !req.body.name) {
		return res.status(500).json({ message: 'Provide username, password, email and name' });
	}

	User.findOne({ username: req.body.username })
		.then(foundUsername => {
			if (foundUsername && (req.user.id != foundUsername.id)) {
				return res.status(500).json({ message: 'The username already exists' });
			}

			return User.findOne({ email: req.body.email });
		}).then(foundEmail => {
			if (foundEmail && (req.user.id != foundEmail.id)) {
				return res.status(500).json({ message: 'The email already exists' });
			}

			let userInfo = {
				username: req.body.username,
				email: req.body.email,
				name: req.body.name,
				gender: req.body.gender,
				city: req.body.city,
				description: req.body.description,
				interests: req.body.interests
			};

			if(req.body.password != req.user.password) {
				const salt = bcrypt.genSaltSync(10);
				const hashPass = bcrypt.hashSync(req.body.password, salt);
	
				userInfo["password"] = hashPass;
			}
	
			if (req.body.languagesOffered) {
				userInfo["languagesOffered"] = JSON.parse(req.body.languagesOffered);
			}
	
			if (req.body.languagesDemanded) {
				userInfo["languagesDemanded"] = JSON.parse(req.body.languagesDemanded);
			}

			if (req.file) {
				cloudinary.v2.uploader.upload(req.file.path)
				.then(result => {
					if (!result) {
						return res.status(500).json({ message: "Somethihg went wrong" });
					}

					userInfo["imageUrl"] = result.secure_url;

					return User.findByIdAndUpdate(req.user.id, { $set: userInfo }, { new: true })
				}).then(newUser => {
					if (!newUser) {
						return res.status(500).json({ message: "Somethihg went wrong" });
					}

					req.user = newUser;
					return res.status(200).json(newUser);
				});
			} else {
				User.findByIdAndUpdate(req.user.id, { $set: userInfo }, { new: true })
				.then(newUser => {
					if (!newUser) {
						return res.status(500).json({ message: "Somethihg went wrong" });
					}

					req.user = newUser;
					return res.status(200).json(newUser);
				});
			}
		}).catch(e => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

router.get('/:id', function (req, res, next) {
	User.findById(req.params.id).exec(
		(err, user) => {
			if (err || !user) {
				return res.status(500).json({ message: "Somethihg went wrong" });
			}
			return res.status(200).json(user);
		});
});

router.get('/', function (req, res, next) {

	User.find({}).exec(
		(err, users) => {
			if (err) {
				return res.status(500).json({ message: "Somethihg went wrong" });
			}
			return res.status(200).json(users);
		});
});

module.exports = router;
