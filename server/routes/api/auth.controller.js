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

let loginPromise = (req, user) => {
	return new Promise((resolve, reject) => {
		req.login(user, e => e ? reject(e) : resolve(user));
	})
}

router.post("/signup", upload.single('file'), (req, res, next) => {
	if (!req.body.username || !req.body.password || !req.body.email || !req.body.name) {
		return res.status(500).json({ message: 'Provide username, password, email and name' });
	}

	User.findOne({ username: req.body.username }, '_id')
		.then(foundUsername => {
			if (foundUsername) {
				return res.status(500).json({ message: 'The username already exists' });
			}

			return User.findOne({ email: req.body.email }, '_id');
		}).then(foundEmail => {
			if (foundEmail) {
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

			let hashPass = bcrypt.hashSync(req.body.password, 10);
			userInfo["password"] = hashPass;
	
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
					
					let newUser = User(userInfo);
		
					newUser.save()
						.then(user => { 
							return loginPromise(req, user)
						}).then(user => {
							return res.status(200).json(req.user)
						});
				});
			} else {
				let newUser = User(userInfo);
		
				newUser.save()
					.then(user => { 
						return loginPromise(req, user)
					}).then(user => {
						return res.status(200).json(req.user)
					});
			}
		}).catch(e => {
			return res.status(500).json({ message: "Somethihg went wrong" });
		});
});

router.post("/login", (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) { return res.status(500).json({ message: 'Something went wrong' }); }
		if (!user) { return res.status(401).json(info); }

		loginPromise(req, user)
			.then((user) => res.status(200).json(user))
			.catch(e => res.status(500).json({ message: 'Something went wrong' }));
	})(req, res, next);
});

router.get("/logout", (req, res, next) => {
	req.logout();
	return res.status(200).json({ message: "Success" });
});

router.get("/loggedin", (req, res) => {
	if (req.isAuthenticated()) {
		return res.status(200).json(req.user);
	} else {
		return res.status(200).json(false);
	}
});

module.exports = router;
