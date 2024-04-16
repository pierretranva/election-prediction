import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import LineGraph from './LineGraph';

const Trends = () => {
    const [chartData, setChartData] = useState(null);
    const [yearsData, setYearsData] = useState([]);
    const [selectedParty, setSelectedParty] = useState('Republican'); // Default selected party

    useEffect(() => {
        const electionYears = [2008, 2012, 2016, 2020];
        
        const fetchDataForYear = async (year) => {
            const response = await axios.get(`http://localhost:3000/db/counties/${year}`);
            return response.data;
        };

        const fetchDataForAllYears = async () => {
            const allData = await Promise.all(electionYears.map(fetchDataForYear));
            setYearsData(allData);
            setChartData(allData[allData.length - 1]); // Set chartData to the data for the last year
        };

        fetchDataForAllYears();

    }, []);

    return (
        <div>
            <h1>Average Share of Votes In Presidential Elections Corresponding to Average Family Income by County Over Time</h1>
            <div>
                <label htmlFor="partySelect">Select Party: </label>
                <select id="partySelect" value={selectedParty} onChange={(e) => setSelectedParty(e.target.value)}>
                    <option value="Republican">Republican</option>
                    <option value="Democratic">Democratic</option>
                    {/* Add more options for other parties if needed */}
                </select>
            </div>
            {chartData && <LineGraph data={yearsData} party={selectedParty} />}
        </div>
    );
};

export default Trends;