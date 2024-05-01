import xlsx from "xlsx"; // Import the xlsx library for reading Excel files
import mongoose, { disconnect } from "mongoose"; // Import mongoose for MongoDB interaction
import {countiesDb, predictionDb, geojsonDb} from "../connection.js"
import dotenv from 'dotenv'
dotenv.config()
//this is used to convert the column names in the excel file to the entry names in the database
//if you add another entry to the database, add it here, you may also need to add it to the countyData schema
const data_dict = {
    "year": "year",
    "county_fips": "county_fips",
    "inctot": "avg_ann_income_indv",
    "mortamt1": "avg_mortgage_payment",
    "avrg_age": "avg_age",
    "ftotinc": "avg_ann_income_family",
    "foodstmp_1_freq": "indv_no_foodstamps_percent",
    "foodstmp_2_freq": "indv_foodstamps_percent",
    "sex_2_freq": "females_percent",
    "sex_1_freq": "males_percent",
    "marst_5_freq": "widowed_percent",
    "marst_6_freq": "never_married_percent",
    "marst_1_freq": "married_spouse_present_percent",
    "marst_4_freq": "divorced_percent",
    "marst_3_freq": "separated_percent",
    "marst_2_freq": "married_spouse_absent_percent",
    "race_1_freq": "white_percent",
    "race_2_freq": "black_percent",
    "race_7_freq": "other_race_percent",
    "race_8_freq": "two_minor_race_percent",
    "race_5_freq": "japanese_percent",
    "race_6_freq": "other_asian_percent",
    "race_3_freq": "american_indian_alaska_native_percent",
    "race_4_freq": "chinese_percent",
    "race_9_freq": "three_plus_races_percent",
    "ctz_stat_1_freq": "citizen_percent",
    "ctz_stat_3_freq": "non_citizen_percent",
    "ctz_stat_2_freq": "naturalized_citizen_percent",
    "lang_1_freq": "english_at_home_percent",
    "lang_2_freq": "other_lang_at_home_percent",
    "educ_attain_2.0_freq": "some_college_or_bachelor_percent",
    "educ_attain_1.0_freq": "high_school_or_lower_education_percent",
    "educ_attain_3.0_freq": "masters_or_professional_cert_percent",
    "educ_attain_4.0_freq": "doctoral_degree_percent",
    "empstat_1.0_freq": "employed_percent",
    "empstat_3.0_freq": "not_in_labor_force_percent",
    "empstat_2.0_freq": "unemployed_percent",
    "state_po": "state_po",
    "county_name": "county_name",
    "democrat": "democrat",
    "green": "green",
    "libertarian": "libertarian",
    "other": "other",
    "republican": "republican",
    "winner": "winner",
};
// Function to parse Excel file and save data to MongoDB
async function parseAndSaveCountyData(filename) {
	try {
		// Read the Excel file
		const workbook = xlsx.readFile(filename);
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];

		// Convert the Excel data to JSON format
		const jsonData = xlsx.utils.sheet_to_json(sheet);

		// Iterate over each line (county) of data
		for (const line of jsonData) {


			const { year, state_county, ...data } = line; // Extract year and state_county, and keep the rest as data fields

			// Create a collection name based on the year
			const collectionName = `year_${year}`;

            let data_to_save = {}
            Object.keys(data).map((key)=>{
                data_to_save[data_dict[key]] = data[key]
                
            })


			// Retrieve the collection
			const collection = countiesDb.collection(collectionName);

			// Check if data exists for the specified year and county number
			const existingData = await collection.findOne({ year, state_county });

			if (existingData) {
			    // If data exists, update the existing entry with new data fields
			    await collection.updateOne({ year, state_county }, { $set: data_to_save });
			    console.log(`Updated data for year ${year} and county ${state_county}`);
			} else {
			    // If data does not exist, insert a new entry with all data fields
			    await collection.insertOne({ year, state_county, ...data_to_save });
			    console.log(`Added new data entry for year ${year} and county ${state_county}`);
			}
		}

		console.log("Data parsing and saving completed");
	} catch (error) {
		console.error("Error:", error);
	} finally {
		// Disconnect from MongoDB after saving all data
		// await mongoose.disconnect();
	}
}

async function praseAndSavePredictionData(filename, algName)
{
    try {
		// Read the Excel file
		const workbook = xlsx.readFile(filename);
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];

		// Convert the Excel data to JSON format
		const jsonData = xlsx.utils.sheet_to_json(sheet);

		// Connect to MongoDB using the provided URI/
		// await mongoose.connect(`${process.env.MONGO_URI}prediction`, {
		//     useNewUrlParser: true,
		//     useUnifiedTopology: true
		// });

		// Iterate over each line (county) of data
		for (const line of jsonData) {

            // console.log(line)
			const { year, state_county, winner, ...data } = line; // Extract year and state_county, and keep the rest as data fields
            // console.log(data)
			// Create a collection name based on the year
			const collectionName = `${algName}_${year}`;

            let data_to_save = {year: year, county_fips: state_county, winner: winner, prediction: data[Object.keys(data)[0]]  };


			// Retrieve the collection
			const collection = predictionDb.collection(collectionName);

			// Check if data exists for the specified year and county number
			const existingData = await collection.findOne({ year, state_county });

			if (existingData) {
			    // If data exists, update the existing entry with new data fields
			    await collection.updateOne(data_to_save);
			    console.log(`Updated data for year ${year} and county ${state_county}`);
			} else {
			    // If data does not exist, insert a new entry with all data fields
			    await collection.insertOne(data_to_save);
			    console.log(`Added new data entry for year ${year} and county ${state_county}`);
			}
		}

		console.log("Input data for prediction is done");
	} catch (error) {
		console.error("Error:", error);
	} finally {
		// Disconnect from MongoDB after saving all data
		// await mongoose.disconnect();
	}
}
async function inputGeojson(geojsonObj)
{
    try{

        const collection = geojsonDb.collection("geojsons");
        await collection.insertOne(geojsonObj);
        console.log("inserted geosjon object into database")
    }
    catch(error)
    {
        console.error("Error:", error);
    }
}

function checkPredictionFileFormat(filename)
{
    const workbook = xlsx.readFile(filename);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the Excel data to JSON format
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    for (const line of jsonData) {

        const { year, state_county, winner, ...data } = line;
        if(year === undefined || state_county === undefined || winner === undefined || Object.keys(data).length != 1)
        {
            return false;
        }
        return true
        break;
    }
}
function checkCountyFileFormat(filename)
{
    const workbook = xlsx.readFile(filename);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the Excel data to JSON format
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    for (const line of jsonData) {

        const { year, state_county, ...data } = line;
        if(year === undefined || state_county === undefined ||  Object.keys(data).length <= 1 )
        {
            return false;
        }
        return true
        break;
    }
}

export {parseAndSaveCountyData, praseAndSavePredictionData, checkCountyFileFormat, checkPredictionFileFormat, inputGeojson};