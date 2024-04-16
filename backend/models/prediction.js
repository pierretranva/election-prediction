// Import mongoose library
import { mongoose, Schema } from "mongoose";
import { predictionDb } from "../connection.js";

// Schema for data from csv file
const predictionSchema = new mongoose.Schema({
    year: Number,
    county_fips: Number,
    winner: Number,
    prediction: Number
});

// Export schema
const getPredictionModel = (collectionName) => {
const predictionData = predictionDb.model(collectionName, predictionSchema);
return predictionData;
}

export default getPredictionModel;
