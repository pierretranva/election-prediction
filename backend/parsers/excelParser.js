import xlsx from 'xlsx'; // Import the xlsx library for reading Excel files
import mongoose from 'mongoose'; // Import mongoose for MongoDB interaction
import { countyData } from './models/countyData.js'; // Assuming you have a model for county data

// Function to parse Excel file and save data to MongoDB
async function parseAndSaveData(filename) {
    try {
        // Read the Excel file
        const workbook = xlsx.readFile(filename);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert the Excel data to JSON format
        const jsonData = xlsx.utils.sheet_to_json(sheet);

        // Connect to MongoDB using the provided URI
        await mongoose.connect('mongodb+srv://admin:admin@cluster0.uspafmk.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Iterate over each line (county) of data
        for (const line of jsonData) {
            const { year, state_county, ...data } = line; // Extract year and state_county, and keep the rest as data fields

            // Check if data exists in the database
            const existingData = await countyData.findOne({ year, state_county });

            // If data does not exist, create a new document and save it to the database
            if (!existingData) {
                const newData = new countyData({ year, state_county, ...data });
                await newData.save();
            }
        }

        console.log('Data parsing and saving completed');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Disconnect from MongoDB after saving all data
        await mongoose.disconnect();
    }
}

// Call the function with the filename of the Excel file
parseAndSaveData('example.xlsx');
