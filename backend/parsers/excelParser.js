import xlsx from 'xlsx'; // Import the xlsx library for reading Excel files
import mongoose from 'mongoose'; // Import mongoose for MongoDB interaction

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
        await mongoose.connect('mongodb+srv://admin:admin@cluster0.uspafmk.mongodb.net/counties', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Iterate over each line (county) of data
        for (const line of jsonData) {
            const { year, state_county, ...data } = line; // Extract year and state_county, and keep the rest as data fields

            // Create a collection name based on the year
            const collectionName = `year_${year}`;

            // Retrieve the collection
            const collection = mongoose.connection.db.collection(collectionName);

            // Check if data exists for the specified year and county number
            const existingData = await collection.findOne({ year, state_county });

            if (existingData) {
                // If data exists, update the existing entry with new data fields
                await collection.updateOne({ year, state_county }, { $set: data });
                console.log(`Updated data for year ${year} and county ${state_county}`);
            } else {
                // If data does not exist, insert a new entry with all data fields
                await collection.insertOne({ year, state_county, ...data });
                console.log(`Added new data entry for year ${year} and county ${state_county}`);
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
parseAndSaveData('data_shared.xlsx');
