import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import LineGraph from './LineGraph';
import { useParams } from 'react-router-dom';
import './App.css';

const Trends = () => {
    const [yearsData, setYearsData] = useState(null);
    const [selectedVariable, setSelectedVariable] = useState('Average Family Income'); // Default selected party
    const { countyFIPS, countyName } = useParams();
    console.log(countyFIPS)
    console.log(countyName)
    useEffect(() => {
        const fetchDataForCounty = async (year) => {
            const response = await axios.get(`http://localhost:3000/db/county/${countyFIPS}`);
            setYearsData(response);
        };

        fetchDataForCounty();

    }, []);

    return (
        <div className="trends-container"> {/* Added a className for styling */}
            <h1>
            {selectedVariable.includes("Income") ? `${selectedVariable} Over Time in ${countyName} County` : `${selectedVariable} Percentage Over Time in ${countyName} County`}
            </h1>
            <div>
                <label htmlFor="partySelect">Select Variable: </label>
                <select id="partySelect" value={selectedVariable} onChange={(e) => setSelectedVariable(e.target.value)}>
                    <option value="Average Family Income">Average Family Income</option>
                    <option value="Average Individual Income">Average Individual Income</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Citizens">Citizens</option>
                    <option value="Employed">Employed</option>
                    <option value="Some college/Bachelor's">Some college/Bachelor's</option>
                    <option value="High School or Lower Education">High School or Lower Education</option>

                    {/* Add more options for other parties if needed */}
                </select>
            </div>
            {yearsData && <LineGraph data={yearsData.data} variable={selectedVariable} />}
        </div>
    );
};

export default Trends;
