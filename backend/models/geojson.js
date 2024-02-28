// Import mongoose library

import { Schema,mongoose } from "mongoose";
import {geojsonDb} from "../connection.js";

const crsSchema = new Schema({ type: String, properties: { name: String }});
const polygonSchema = new Schema({
    type: {
      type: String,
      enum: ['Polygon'],
      required: true
    },
    coordinates: {
      type: [[[Number]]], // Array of arrays of arrays of numbers
      required: true
    }
  });
const featureSchema = new Schema({ type: String, properties: { 
    STATEFP: String,
    COUNTYFP: String, 
    COUNTYNS: String, 
    AFFGEOID: String,
    GEOID: Number, 
    NAME: String,
    LSAD: String, 
    ALAND: String,
    AWATER: String     
}, geometry: polygonSchema});

// Create schema
const geojsonSchema = new mongoose.Schema({
    type: String,
    name: String,
    crs: Object,
    features: [Object]


    
}, {versionKey: false});



const geojson = geojsonDb.model('geojsons', geojsonSchema);

export default geojson;

