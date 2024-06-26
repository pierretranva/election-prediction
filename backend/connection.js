import {mongoose } from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

//connect to mongodb database
const geojsonDb = mongoose.createConnection(process.env.MONGO_URI + "geojson?retryWrites=true&w=majority");

const countiesDb = mongoose.createConnection(process.env.MONGO_URI + "counties?retryWrites=true&w=majority");

const userDb = mongoose.createConnection(process.env.MONGO_URI + "user?retryWrites=true&w=majority");

const predictionDb = mongoose.createConnection(process.env.MONGO_URI + "prediction?retryWrites=true&w=majority");


export { geojsonDb, countiesDb, userDb, predictionDb };
