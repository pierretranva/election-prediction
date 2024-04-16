import xlsx from "xlsx"; // Import the xlsx library for reading Excel files
import mongoose from "mongoose"; // Import mongoose for MongoDB interaction
import * as fs from 'fs';

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
async function parseAndSaveData(filename) {
    try {
        const workbook = xlsx.readFile(filename);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet);

        await mongoose.connect('mongodb+srv://admin:admin@cluster0.uspafmk.mongodb.net/counties', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        for (const line of jsonData) {
            const { year, state_county, ...data } = line;
            const collectionName = `year_${year}`;
            let data_to_save = {};
            Object.keys(data).map((key) => {
                data_to_save[data_dict[key]] = data[key];
            });

            const collection = mongoose.connection.db.collection(collectionName);
            const existingData = await collection.findOne({ year, state_county });

            if (existingData) {
                await collection.updateOne({ year, state_county }, { $set: data_to_save });
                console.log(`Updated data for year ${year} and county ${state_county}`);
            } else {
                await collection.insertOne({ year, state_county, ...data_to_save });
                console.log(`Added new data entry for year ${year} and county ${state_county}`);
            }
        }

        console.log("Data parsing and saving completed");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

async function edit_prediction(prediction_filename) {
    try {
        const workbook = xlsx.readFile(prediction_filename);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const predictionData = xlsx.utils.sheet_to_json(sheet);

        await mongoose.connect('mongodb+srv://admin:admin@cluster0.uspafmk.mongodb.net/predictions', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        for (const line of predictionData) {
            const { year, state_county, ...data } = line;
            const collectionName = `year_${year}`;
            let data_to_save = {};
            Object.keys(data).map((key) => {
                data_to_save[data_dict[key]] = data[key];
            });

            const collection = mongoose.connection.db.collection(collectionName);
            const existingData = await collection.findOne({ year, state_county });

            if (existingData) {
                await collection.updateOne({ year, state_county }, { $set: data_to_save });
                console.log(`Updated data for year ${year} and county ${state_county}`);
            } else {
                await collection.insertOne({ year, state_county, ...data_to_save });
                console.log(`Added new data entry for year ${year} and county ${state_county}`);
            }
        }

        console.log("Prediction editing and saving completed");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

//parseAndSaveData("data_shared.xlsx");
edit_prediction("probit_predictions.xlsx");