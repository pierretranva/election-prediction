import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import { geojsonDb, countiesDb } from "./connection.js";
import { default as geojsonSchema } from "./models/geojson.js";
import { default as userSchema } from "./models/user.js";
import { default as getCountyModel } from "./models/countyData.js";
import dotenv from "dotenv";
import multer from "multer"
import { parseAndSaveCountyData, praseAndSavePredictionData, checkCountyFileFormat, checkPredictionFileFormat } from "./parsers/excelParser.js";
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
	// console.log(response);
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
					console.log(items);
					res.status(200).json(items);
				} else {
					res.status(401).send("invalid password");
				}
			});
		} else {
			res.status(401).send("invalid username");
		}
	});
});

router.route("/county/:county").get(async (req, res) => {
	// the county param should be the fibs code
	let collections_res = await countiesDb.listCollections();
	let collections_list = [];
	collections_res.map((i) => {
		collections_list.push(i.name);
	});
	collections_list.sort(); // sorted array of the county collection names

	let all_years = false;
	if (req.query.year === undefined) {
		//if no year is specified, return all years.
		all_years = true;
	}

	if (all_years) {
		let all_years_data = [];
		for (let i = 0; i < collections_list.length; i++) {
			let response = await getCountyModel(collections_list[i])
				.find({ state_county: parseInt(req.params.county) })
				.exec();
			all_years_data.push(response);
		}
		// console.log(all_years_data);

		res.json(all_years_data);
	} else {
		let response = await getCountyModel("year_" + req.query.year)
			.find({ state_county: parseInt(req.params.county) })
			.exec();
		// console.log(response);
		res.json(response);
	}
});

router.route("/counties/:year").get(async (req, res) => {
	// returns all the counties in the specified year

	let response = await getCountyModel("year_" + req.params.year)
		.find()
		.exec();
	// console.log(response);
	res.json(response);
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
const upload = multer({storage: storage}) 

  router.post("/upload", upload.single("file"), async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    if(req.body.fileType === 'county')
    {
        if(!checkCountyFileFormat(req.file.path))
        {
            res.status(400).json({ message: "Invalid file format for county data" });
            return
        }
    
     await parseAndSaveCountyData(req.file.path)
    }
    else if(req.body.fileType === 'prediction' )
    {
        if(!checkPredictionFileFormat(req.file.path))
        {
            res.status(400).json({ message: "Invalid file format for prediction" });
            return
        }
       await praseAndSavePredictionData(req.file.path, req.body.algName)
    }
    else {
        res.status(400).json({ message: "Invalid file type" });
        return;
    }
    res.json({ message: "Successfully uploaded files" });
   
  });
  
const port = process.env.PORT;
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
