// Import mongoose library
const mongoose = require('mongoose');

// Schema for data from csv file
const dataSchema = new mongoose.Schema({
    year: Number,
    state_county: Number,
    inctot: Number,
    mortamt1: Number,
    sex: Number,
    age: Number,
    ftotinc: Number,
    foodstmp_1: Number,
    foodstmp_2: Number,
    foodstmp_All: Number,
    foodstmp_1_freq: Number,
    foodstmp_2_freq: Number,
    sex_1: Number,
    sex_2: Number,
    sex_All: Number,
    sex_2_freq: Number,
    sex_1_freq: Number,
    marst_1: Number,
    marst_2: Number,
    marst_3: Number,
    marst_4: Number,
    marst_5: Number,
    marst_6: Number,
    marst_All: Number,
    marst_5_freq: Number,
    marst_6_freq: Number,
    marst_1_freq: Number,
    marst_4_freq: Number,
    marst_3_freq: Number,
    marst_2_freq: Number,
    race_1: Number,
    race_2: Number,
    race_3: Number,
    race_4: Number,
    race_5: Number,
    race_6: Number,
    race_6: Number,
    race_7: Number,
    race_8: Number,
    race_9: Number,
    race_All: Number,
    race_1_freq: Number,
    race_2_freq: Number,
    race_7_freq: Number,
    race_8_freq: Number,
    race_5_freq: Number,
    race_6_freq: Number,
    race_3_freq: Number,
    race_4_freq: Number,
    race_9_freq: Number,
    ctz_stat_1: Number,
    ctz_stat_2: Number,
    ctz_stat_3: Number,
    ctz_stat_All: Number,
    ctz_stat_1_freq: Number,
    ctz_stat_3_freq: Number,
    ctz_stat_2_freq: Number,
    lang_1: Number,
    lang_2: Number,
    lang_All: Number,
    lang_1_freq: Number,
    lang_2_freq: Number,
    educ_attain_1: Number,
    educ_attain_2: Number,
    educ_attain_3: Number,
    educ_attain_4: Number,
    educ_attain_All: Number,
    educ_attain_2_freq: Number,
    educ_attain_1_freq: Number,
    educ_attain_3_freq: Number,
    educ_attain_4_freq: Number,
    empstat_1: Number,
    empstat_2: Number,
    empstat_3: Number,
    empstat_All: Number,
    empstat_1_freq: Number,
    empstat_3_freq: Number,
    empstat_2_freq: Number,
    state_po: Number,
    county_name: Number,
    democrat: Number,
    green: Number,
    liberitarian: Number,
    other: Number,
    republican: Number,
    winner: Number
});

module.exports = mongoose.model('data', dataSchema);
