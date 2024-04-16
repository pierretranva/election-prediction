import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

function calculatePercentile(values, percentile) {
    // Step 1: Sort the array
    const sortedValues = values.slice().sort((a, b) => a - b);

    // Step 2: Calculate the index
    const index = (percentile / 100) * (sortedValues.length - 1);

    // Step 3: Interpolate the value if the index is not an integer
    if (Number.isInteger(index)) {
        return sortedValues[index];
    } else {
        const lowerIndex = Math.floor(index);
        const upperIndex = Math.ceil(index);
        const lowerValue = sortedValues[lowerIndex];
        const upperValue = sortedValues[upperIndex];
        return lowerValue + (upperValue - lowerValue) * (index - lowerIndex);
    }
}

function calculateAverage(numbers) {
    // Filter out NaN values
    const validNumbers = numbers.filter(number => !isNaN(number));

    // Check if the array is empty after filtering
    if (validNumbers.length === 0) {
        return NaN; // Return NaN if all values are NaN or the array is empty
    }

    // Calculate the sum of all valid numbers in the array
    const sum = validNumbers.reduce((acc, currentValue) => acc + currentValue, 0);

    // Calculate the average
    const average = sum / validNumbers.length;

    return average;
}

const LineGraph = ({ data, party }) => {
  //console.log(data)
  const chartRef = useRef(null);
  const dataOverTime10th = []
  const dataOverTime25th = []
  const dataOverTime50th = []
  const dataOverTime75th = []
  const dataOverTime90th = []
  const dataOverTimeTop10th = []

  for (let i = 0; i < 4; i++){
    let incomePartyTuples = []
    data[i].forEach(county => {
        console.log(county.county_name + " ")
        const incomeForYear = county.avg_ann_income_family.toString()
        console.log("$" + incomeForYear)
        const rVotes = county.republican
        const dVotes = county.democrat
        const total = rVotes + dVotes
        const percentR = (rVotes / total) * 100
        const percentD = (dVotes / total) * 100
        incomePartyTuples.push({income: incomeForYear, percentR: percentR, percentD: percentD})
    });

    const incomes = []
    incomePartyTuples.forEach(tuple => {
        incomes.push(tuple.income)
    })

    const tenthPercentile = calculatePercentile(incomes, 10);
    const twentyFifthPercentile = calculatePercentile(incomes, 20);
    const fiftiethPercentile = calculatePercentile(incomes, 50);
    const seventyFifthPercentile = calculatePercentile(incomes, 75);
    const ninetiethPercentile = calculatePercentile(incomes, 90);

    const perR10th = []
    const perR25th = []
    const perR50th = []
    const perR75th = []
    const perR90th = []
    const top10thR = []

    incomePartyTuples.forEach(tuple => {
        if(tuple.income <= tenthPercentile){
            perR10th.push(tuple.percentR)
        }
        else if (tuple.income > tenthPercentile && tuple.income <= twentyFifthPercentile){
            perR25th.push(tuple.percentR)
        }
        else if (tuple.income > twentyFifthPercentile && tuple.income <= fiftiethPercentile){
            perR50th.push(tuple.percentR)
        }
        else if (tuple.income > fiftiethPercentile && tuple.income <= seventyFifthPercentile){
            perR75th.push(tuple.percentR)
        }
        else if (tuple.income > seventyFifthPercentile && tuple.income <= ninetiethPercentile){
            perR90th.push(tuple.percentR)
        }
        else if (tuple.income > ninetiethPercentile){
            top10thR.push(tuple.percentR)
        }
    })

    const avgR10th = calculateAverage(perR10th)
    const avgR25th = calculateAverage(perR25th)
    const avgR50th = calculateAverage(perR50th)
    const avgR75th = calculateAverage(perR75th)
    const avgR90th = calculateAverage(perR90th)
    const avgTop10thR = calculateAverage(top10thR)

    
    let avgIncomes = []
    if (party === "Democratic"){
        avgIncomes.push(100 - avgR10th)
        avgIncomes.push(100 - avgR25th)
        avgIncomes.push(100 - avgR50th)
        avgIncomes.push(100 - avgR75th)
        avgIncomes.push(100 - avgR90th)
        avgIncomes.push(100 - avgTop10thR)
    }
    else if (party === "Republican"){
        avgIncomes.push(avgR10th)
        avgIncomes.push(avgR25th)
        avgIncomes.push(avgR50th)
        avgIncomes.push(avgR75th)
        avgIncomes.push(avgR90th)
        avgIncomes.push(avgTop10thR)
    }


    dataOverTime10th.push(avgIncomes[0])
    dataOverTime25th.push(avgIncomes[1])
    dataOverTime50th.push(avgIncomes[2])
    dataOverTime75th.push(avgIncomes[3])
    dataOverTime90th.push(avgIncomes[4])
    dataOverTimeTop10th.push(avgIncomes[5])
  }
  useEffect(() => {
    let chartInstance = null;
    const ctx = chartRef.current.getContext('2d');
    
    if (chartInstance){
        chartInstance.destroy();
    }
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
            {
                label: '<= 10th Percentile',
                data: dataOverTime10th
            },
            {
                label: '> 10th and <= 25th Percentile',
                data: dataOverTime25th
            },
            {
                label: '> 25th and <= 50th Percentile',
                data: dataOverTime50th
            },
            {
                label: '> 50th and <= 75th Percentile',
                data: dataOverTime75th
            },
            {
                label: '> 75th and <= 90th Percentile',
                data: dataOverTime90th
            },
            {
                label: '> 90th Percentile',
                data: dataOverTimeTop10th
            },
            ],
            labels: ['2008', '2012', '2016', '2020']
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Election Year'
                    }
                },
                y: {
                    suggestedMin: 0,
                    suggestedMax: 100,
                    title: {
                        display: true,
                        text: '% ' + party
                    }
                }
            }
        }
        });
        return () => {
            // Cleanup: Destroy chart instance when component unmounts
            if (chartInstance) {
              chartInstance.destroy();
            }
        };
  }, );

  return <canvas ref={chartRef} />;
};

export default LineGraph;