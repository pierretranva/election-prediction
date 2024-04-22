// Import mongoose library
import mongoose from "mongoose";
import { predictionDb } from "../connection.js";

// Schema for data from csv file
const predictionSchema = new mongoose.Schema({
    year: Number,
    county_fips: Number,
    winner: Number,
    prediction: Number
}, { collection: 'placeholder' }); 

const modelCache = {};

// Function to get or create a model for a specific collection
const getPredictionModel = (collectionName) => {
    if (!modelCache[collectionName]) {
        modelCache[collectionName] = predictionDb.model(collectionName, predictionSchema, collectionName);
    }
    return modelCache[collectionName];
}

export default getPredictionModel;
