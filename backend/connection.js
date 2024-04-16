import {mongoose } from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

//connect to mongodb database
const geojsonDb = mongoose.createConnection(process.env.MOGNO_URI + "geojson?retryWrites=true&w=majority");

const countiesDb = mongoose.createConnection(process.env.MOGNO_URI + "counties?retryWrites=true&w=majority");

const userDb = mongoose.createConnection(process.env.MOGNO_URI + "user?retryWrites=true&w=majority");

const predictionsDb = mongoose.createConnection(process.env.MOGNO_URI + "predictions?retryWrites=true&w=majority");



export { geojsonDb, countiesDb, userDb, predictionsDb };
