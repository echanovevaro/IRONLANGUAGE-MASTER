const express		 = require("express");
const router		 = express.Router();
const Meetup		 = require("../../models/meetup");

router.post('/', function (req, res, next) {

	let meetupInfo = {
		owner: req.user._id,
		description: req.body.description,
		date: req.body.date,
		place: req.body.place,
		address: req.body.address,
		location: req.body.location,
		city: req.body.city
	};

	if (req.body.languages) {
		meetupInfo["languages"] = JSON.parse(req.body.languages);
	}//angular con formulario y viceversa

	let newMeetup = Meetup(meetupInfo);

	return newMeetup.save()
		.then(meetup => res.status(200).json(meetup))
		.catch(e => {
			return res.status(500).json(e);
		});
});

router.get('/', function (req, res, next) {
//mas grande que la fecha actual, operador de mongo
//Para eso necesitamos hacer uso del método populate de MongoDB que también implementa la librería mongoose.
//quiero popular el campo mettup owner q es de tipo user
	Meetup.find({date: { $gt: new Date() }})
		.populate({ path: 'owner', model: 'User' })
		.exec()
		.then(meetups => res.status(200).json(meetups))
		.catch(e => {
			return res.status(500).json({ message: "Something went wrong" });
		});;
});

router.get('/detail/:id', function (req, res, next) {
	
	Meetup.findById(req.params.id)
		.populate({ path: 'owner assist', model: 'User'})
		.exec()
		.then(meetup => res.status(200).json(meetup))
		.catch(e => {
			return res.status(500).json({ message: "Something went wrong" });
		});;
});

router.post('/assist', function (req, res, next) {

	Meetup.findByIdAndUpdate(req.body.meetup, { $addToSet: { assist: req.body.user } }, {new: true})
		.populate({ path: 'owner assist', model: 'User' })
		.then(meetup => res.status(200).json(meetup))
		.catch(e => {
			return res.status(500).json({ message: "Something went wrong" });
		});;
});

router.get('/:id/assist', function (req, res, next) {
//todos los eventos a los que vayas a asistir posteriores a la fecha actual
	Meetup.find({ date: { $gt: new Date() }, assist: req.params.id })
		.populate({ path: 'owner assist', model: 'User' })
		.then(meetups => res.status(200).json(meetups))
		.catch(e => {
			return res.status(500).json({ message: "Something went wrong" });
		});;
});

module.exports = router;