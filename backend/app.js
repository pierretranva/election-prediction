import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import { geojsonDb, countiesDb } from "./connection.js";
import { default as geojsonSchema } from "./models/geojson.js";
import { default as userSchema } from "./models/user.js";
import dotenv from "dotenv";
dotenv.config();

// Set the web server
const app = express();
app.use(express.json({ limit: 10000000 }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.get(
	"/",
	(req, res) => res.send("<h1>Election Prediction Backend</h1>") // Home web page
);

// Create routes for database access

const router = express.Router();
app.use("/db", router);

//get geojson data
router.route("/geojson").get(async (req, res) => {
	let response = await geojsonSchema.find().exec();
	console.log(response);
	res.json(response);
});
//insert geojson data
router.route("/geojson").post((req, res) => {
	geojsonSchema.create(req.body).then((item) => {
		res.json(item._id);
	});
});

router.route("/user/register").post((req, res) => {
	userSchema.find({ username: req.body.username }).then((item) => {
		if (item.length != 0) {
			res.status(401).json("Username already used");
			console.log("trying to duplicate thing");
			res.end();
			return;
		} else {
			bcrypt.hash(req.body.password, 10, function (err, hash) {
				userSchema.create({ username: req.body.username, password: hash, email: req.body.email }).then((newUser) => {
					res.json(newUser);
				});
			});
		}
	});
});

router.route("/user/login").post((req, res) => {
	userSchema.findOne({ username: req.body.username }).then((items) => {
		if (items) {
			bcrypt.compare(req.body.password, items.password, function (err, result) {
				if (result) {
                    console.log(items)
                    res.status(200).json(items)
				} else {
					res.status(401).send("invalid password");
				}
			});
		} else {
			res.status(401).send("invalid username");
		}
	});
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
