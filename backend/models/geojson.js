// Import mongoose library
const mongoose = require('mongoose');

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
    crs: crsSchema,
    features: [featureSchema]


    
}, {versionKey: false});

// Export schema
module.exports = mongoose.model('geojson', geojsonSchema);
