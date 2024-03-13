import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import { geojsonDb, countiesDb } from "./connection.js";
import { default as geojsonSchema } from "./models/geojson.js";
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

const port = process.env.PORT;
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
