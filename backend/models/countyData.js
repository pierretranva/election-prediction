// Import mongoose library
import { mongoose, Schema } from "mongoose";
import { countiesDb } from "../connection.js";

// Schema for data from csv file
const countyDataSchema = new mongoose.Schema({
    year: Number,
    county_fips: Number,
    avg_ann_income_indv: Number,
    avg_mortgage_payment: Number,
    avg_age: Number,
    avg_ann_income_family: Number,
    indv_no_foodstamps_percent: Number,
    indv_foodstamps_percent: Number,
    females_percent: Number,
    males_percent: Number,
    widowed_percent: Number,
    never_married_percent: Number,
    married_spouse_present_percent: Number,
    divorced_percent: Number,
    separated_percent: Number,
    married_spouse_absent_percent: Number,
    white_percent: Number,
    black_percent: Number,
    other_race_percent: Number,
    two_minor_race_percent: Number,
    japanese_percent: Number,
    other_asian_percent: Number,
    american_indian_alaska_native_percent: Number,
    chinese_percent: Number,
    three_plus_races_percent: Number,
    citizen_percent: Number,
    non_citizen_percent: Number,
    naturalized_citizen_percent: Number,
    english_at_home_percent: Number,
    other_lang_at_home_percent: Number,
    some_college_or_bachelor_percent: Number,
    high_school_or_lower_education_percent: Number,
    masters_or_professional_cert_percent: Number,
    doctoral_degree_percent: Number,
    employed_percent: Number,
    not_in_labor_force_percent: Number,
    unemployed_percent: Number,
    state_po: String,
    county_name: String,
    democrat: Number,
    green: Number,
    liberitarian: Number,
    other: Number,
    republican: Number,
    winner: Number
});

// Export schema
const getCountyModel = (collectionName) => {
const countyData = countiesDb.model(collectionName, countyDataSchema);
return countyData;
}

export default getCountyModel;
