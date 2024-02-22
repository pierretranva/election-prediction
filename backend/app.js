const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

// Set the web server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.get(
	"/",
	(req, res) => res.send("<h1>Cloud Project Backend</h1>") // Home web page
);

// Connect to MongoDB database
mongoose.Promise = global.Promise;
mongoose.connect("", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
mongoose.connection.once("open", function () {
	console.log("Connection with MongoDB was successful");
});

// Create routes for database access
const jobSchema = require("./models/job");
const profileSchema = require("./models/profile");
const userSchema = require("./models/user");

const router = express.Router();
app.use("/db", router);

//get all job entries
router.route("/jobs").get((req, res) => {
	jobSchema.find().then(function (items) {
		// console.log(items);
		//find all items are returns
		res.json(items);
	});
});

//update one job entry
router.route("/jobs/update/:id").post((req, res) => {
	jobSchema.findById(req.params.id).then((item) => {
		//need to add in the code here later to update the entry

		item
			.save()
			.then((item) => {
				res.json;
			})
			.catch((err) => {
				res.status(400).send("Update not possible");
			});
	});
});

//create job entry
router.route("/jobs/create").post((req, res) => {
	console.log(req.body);
	jobSchema.create(req.body).then((item) => {
		jobSchema.find().then(function (items) {
			// console.log(items);
			//find all items are returns
			res.json(items);
		});
	});
});

//register new user
router.route("/user/register").post((req, res) => {
	userSchema.find({ username: req.body.username }).then((item) => {
		if (item.length != 0) {
			res.status(401).json("Username already used");
			console.log("trying to duplicate thing");
			res.end();
			return;
		} else {
			bcrypt.hash(req.body.password, 10, function (err, hash) {
				profileSchema
					.create({
						firstName: "",
						lastName: "",
						location: "",
						age: 0,
						height: "",
						weight: 0,
						bio: "",
						image: "/firefighter.jpg",
						tags: [],
						jobs: [
							{
								title: "Firefighter",
								year: "2018 - 2022",
								description: "Worked at the Springfield Fire Department",
								image: "powerPlant.jpeg",
							},
							{
								title: "Paramedic",
								year: "2015 - 2018",
								description: "Served as a paramedic in the Springfield region",
								image: "firefighter.jpg",
							},
						],
					})
					.then((item) => {
						userSchema.create({ username: req.body.username, password: hash, profile: item._id }).then((thing) => {
							res.json(thing);
						});
					});
			});
		}
	});
});

//user login
router.route("/user/login").post((req, res) => {
	userSchema.findOne({ username: req.body.username }).then((items) => {
		if (items) {
			bcrypt.compare(req.body.password, items.password, function (err, result) {
				if (result) {
					res.json(items);
				} else {
					res.status(401).send("invalid password");
				}
			});
		} else {
			res.status(401).send("invalid username");
		}
	});
});

//get profile by id
router.route("/profile/:id").get((req, res) => {
	profileSchema
		.findById(req.params.id)
		.then((item) => {
			res.json(item);
		})
		.catch((err) => {
			res.status(400).send("Profile ID not valid");
		});
});

//update profile by id
router.route("/profile/update/:id").post((req, res) => {
	console.log(req.body);
	profileSchema.findById(req.params.id).then(function (item) {
		item.firstName = req.body.firstName;
		item.lastName = req.body.lastName;
		item.location = req.body.location;
		item.age = req.body.age;
		item.height = req.body.height;
		item.weight = req.body.weight;
		item.bio = req.body.bio;
		item.tags = req.body.tags;

		item
			.save()
			.then((items) => {
				console.log("Items Updated");
				res.json("Items updated!");
			})
			.catch((err) => {
				res.status(400).send("Update not possible");
			});
	});
});
//get all users in db
router.route("/profiles").get((req, res) => {
	profileSchema
		.find()
		.then(function (profiles) {
			res.json(profiles);
		})
		.catch(function (error) {
			res.status(400).send("Could not retrieve profiles");
		});
});

// Export the app to be used in bin/www.js
// module.exports = app;
const port = 3000;
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
