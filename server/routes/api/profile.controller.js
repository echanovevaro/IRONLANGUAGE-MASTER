const express        = require("express");
const passport		 = require("passport");
const router		 = express.Router();
const bcrypt         = require("bcrypt");
const multer		 = require('multer');
const User			 = require("../../models/user");

let upload = multer({
	dest: './public/images/profiles'
});

router.post("/", upload.single('file'), (req, res, next) => {
	if (!req.body.username || !req.body.password || !req.body.email || !req.body.name) {
		return res.status(500).json({ message: 'Provide username, password, email and name'});
	}

    if(req.user.username != req.body.username) {
        User.findOne({ username: req.body.username }, '_id')
		.then(foundUsername => {
			if (foundUsername) {
				return res.status(500).json({ message: 'The username already exists' });
            }
        });
    }
	
    if(req.user.email != req.body.email) {
        User.findOne({ email: req.body.email }, '_id')
            .then(foundEmail => {
                if (foundEmail) {
                    return res.status(500).json({ message: 'The email already exists' });
                }
            });
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

    if(req.user.password != req.body.password) {
        let hashPass = bcrypt.hashSync(req.body.password, 10);
        userUnfo['password'] = hashPass;
    }

    if(req.body.languagesOffered){
		userInfo['languagesOffered'] = JSON.parse(req.body.languagesOffered);
	}

	if(req.body.languagesDemanded){
		userInfo['languagesDemanded'] = JSON.parse(req.body.languagesDemanded);
	}

	if (req.file) {
		userInfo['imageUrl']= `/images/profiles/${req.file.filename}`;
	}

    User.findByIdAndUpdate(req.user._id, {$set: userInfo}, {new: true})
    .then(newUser => {
        req.user = newUser;
        return res.status(200).json(newUser);
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