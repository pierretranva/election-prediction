import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const LineGraph = ({data, variable}) => {
    // console.log(data)
    // console.log(variable)
    const yValues = []
    let yVar = ""
    switch (variable) {
        case "Average Family Income":
            yVar = "avg_ann_income_family"
            break;
        case "Average Individual Income":
            yVar = "avg_ann_income_indv"
            break;
        case "Male":
            yVar = "males_percent"
            break;
        case "Female":
            yVar = "females_percent"
            break;   
        case "Citizens":
            yVar = "citizen_percent"
            break; 
        case "Employed":
            yVar = "employed_percent"
            break;
        case "Some college/Bachelor's":
            yVar = "some_college_or_bachelor_percent"
            break;   
        case "High School or Lower Education":
            yVar = "high_school_or_lower_education_percent"
            break; 
        default:
            yVar = "avg_ann_income_family"
    }

    for (let i = 0; i < data.length; i++){
        if(data[i].length !== 0){
            yValues.push(data[i][0][yVar])
        }
        else{
            yValues.push(null)
        }
    }

  const chartRef = useRef(null);
  
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
                label: variable,
                data: yValues
            },
            ],
            labels: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: variable
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            // Check if the variable includes "percent"
                            if (yVar.includes("percent")) {
                                // Convert value to percentage format
                                return value.toFixed(2) + '%';
                            } else {
                                // Convert value to currency format
                                return '$' + value.toLocaleString();
                            }
                        }
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