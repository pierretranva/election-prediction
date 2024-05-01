import React, { useState, useEffect, useRef, createContext, useContext} from "react";
import { Route, Routes} from "react-router-dom";
import { Map, FullscreenControl, Popup, Marker, Source, Layer } from "react-map-gl";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import axios from 'axios';
import {Button, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { LegendToggle } from "@mui/icons-material";
import Trends from './Trends'
import { useNavigate } from "react-router-dom";

const MapPage = () => {
	const [data, setData] = useState([]);
	const [originalData, setOriginalData] = useState([]); // store original county data
	const [geoJsonData, setGeoJsonData] = useState([]);
	const [popupInfo, setPopupInfo] = useState(null);
	const [usePrediction, setUsePrediction] = useState(false);
	const [selectedModel, setSelectedModel] = useState('');
	const [models, setModels] = useState([]);
	const [year, setYear] = useState(2020);
	const mapRef = useRef(null);
	const navigate = useNavigate();
    const [fillLayerStyle, setFillLayerStyle] = useState({ id: 'county-fill',
    type: 'fill',
    paint: {
        'fill-color': [
            'match', // Use the match expression
            ['get', 'GEOID'], // Get the GEOID from the properties
            '1000', 'grey',
            'grey' // Default color for other counties
        ],
        'fill-opacity': 0.2,
    }})

	useEffect(() => {
		axios.get(`${process.env.REACT_APP_API_URL}/db/geojson`)
		  .then((response) => {
			setGeoJsonData(response.data[0]);
		  });
	  }, []);



	  useEffect(() => {
		axios.get(`${process.env.REACT_APP_API_URL}/db/counties/${year}`)
		  .then(response => setOriginalData(response.data)); // fetch and store original data
	  }, [year]);

	
	  useEffect(() => {
		if (usePrediction && selectedModel) {
		  axios.get(`${process.env.REACT_APP_API_URL}/db/prediction/${selectedModel}`)
			.then(response => setData(response.data));
		} else {
		  setData(originalData);
		}
	  }, [originalData, selectedModel, usePrediction]);
	  
	  
	  useEffect(() => {
		updateMapColors(data); // update map colors whenever prediction data changes
	  }, [data]);
	  
	  const updateMapColors = (dataToColor) => {
		if (!dataToColor) {
		  console.log("No data provided to color");
		  return;
		}
	  
		let paintLayerArray = ['match', ['get', 'GEOID']];
		dataToColor.forEach(county => {
		  if (county && county.state_county) { // state_county is fips for actual data
			let color;
			if (county.winner === 0) {
			  color = 'blue'; // Fully blue
			} else if (county.winner === 1) {
			  color = 'red'; // Fully red
			} else {
			  // interpolate colors based on the value of 'winner'
			  if (county.winner <= 0.5) {
				const intensity = Math.round(255 * (0.5 - county.winner) * 2);
				color = `rgb(0, 0, ${255 - intensity})`; // Darker blue as it approaches 0
			  } else {
				const intensity = Math.round(255 * (county.winner - 0.5) * 2);
				color = `rgb(${intensity}, 0, 0)`; // Darker red as it approaches 1
			  }
			}
			paintLayerArray.push(county.state_county.toString(), color);
		  }
		  else if (county && county.county_fips) { // county_fips is fips for prediction data
			let color;
			if (county.prediction === 0) {
			  color = 'blue'; // Fully blue
			} else if (county.prediction === 1) {
			  color = 'red'; // Fully red
			} else {
			  // Interpolate colors based on the value of 'prediction'
			  if (county.prediction <= 0.5) {
				const intensity = Math.round(255 * (0.5 - county.prediction) * 10);
				color = `rgb(0, 0, ${intensity})`;
			  } else {
				const intensity = Math.round(255 * (county.prediction - 0.5) * 10);
				color = `rgb(${intensity}, 0, 0)`;
			  }
			}
			paintLayerArray.push(county.county_fips.toString(), color);
		  }
		  else {
			console.log("Missing 'state_county' or 'winner' in county data", county);
		  }
		});
		paintLayerArray.push('grey'); // Default color for unmatched GEOID

		setFillLayerStyle({
		  ...fillLayerStyle,
		  paint: { 'fill-color': paintLayerArray, 'fill-opacity': 0.4 }
		});
	  };
	  
	  
	  useEffect(() => {
		if (usePrediction) {
		  axios.get(`${process.env.REACT_APP_API_URL}/db/prediction/models`)
			.then(res => {
			  setModels(res.data);
			  if (res.data.length > 0) {
				setSelectedModel(res.data[0]);  // automatically select the first model
			  }
			});
		} else {
		  setSelectedModel('');  // clear model selection when not in prediction mode
		}
	  }, [usePrediction]);
	  

	  useEffect(() => {
		const fetchYear = usePrediction ? extractYearFromModel(selectedModel) : year;
		axios.get(`${process.env.REACT_APP_API_URL}/db/counties/${fetchYear}`)
		  .then(response => {
			setOriginalData(response.data);
		  });
	  }, [year, selectedModel, usePrediction]);
	
	  const handleYearChange = (e) => {
		setYear(e.target.value);
	  };
	
	  const handleModelChange = (e) => {
		setSelectedModel(e.target.value);
	  };
	
	  const handleTogglePrediction = () => {
		setUsePrediction(!usePrediction);
	  };

	  const extractYearFromModel = (modelName) => {
		return modelName.split('_')[1];
	  };
	
	  
	
	const layerStyle = {
	id: 'county-boundaries',
	type: 'line',
	paint: {
		'line-width': 0.8,
		'line-color': '#a0a0a0',
	},
	};

		
	const handleMouseMove = (e) => {
		if (!mapRef.current) return;
		const map = mapRef.current.getMap();
		const features = map.queryRenderedFeatures(e.point, { layers: ['county-fill'] });
	
		if (features.length > 0) {
		  const feature = features[0];
		  const countyFIPS = feature.properties.GEOID;
		  const detailsForYear = originalData.find(county => county.state_county && county.state_county.toString() === countyFIPS);
		  
		  if (detailsForYear) {
			setPopupInfo({
			  details: detailsForYear,
			  longitude: e.lngLat.lng,
			  latitude: e.lngLat.lat,
			  countyName: feature.properties.NAME,
			});
		  } else {
			setPopupInfo(null);
		  }
		} else {
		  setPopupInfo(null);
		}
	  };
    
    const handleMouseClick = (e) =>
    {
        if (!mapRef.current) return;
		const map = mapRef.current.getMap();
		const features = map.queryRenderedFeatures(e.point, { layers: ['county-fill'] });
	
		if (features.length > 0) {
		  const feature = features[0];
		  const countyFIPS = feature.properties.GEOID;
		  const detailsForYear = originalData.find(county => county.state_county && county.state_county.toString() === countyFIPS);
		  
		  if (detailsForYear) {
			console.log("Clicked on: ", detailsForYear);
            navigate(`/trends/${countyFIPS}/${feature.properties.NAME}`);
          }
		}
    }
    useEffect(() => {
        console.log(popupInfo)
    })
	
	return (
		<div style={{ width: "100vw", height: "93vh"}}>
		  <Button onClick={handleTogglePrediction} style={{ position: 'absolute', top: 130, left: 10, zIndex: 1000 }}>
			{usePrediction ? 'Show Actual Data' : 'Show Prediction Data'}
		  </Button>
		  <FormControl style={{ position: 'absolute', top: 80, left: 10, zIndex: 1000 }}>
			{usePrediction ? (
			  <div>
				<InputLabel id="model-label">Prediction Model</InputLabel>
				<Select
				  labelId="model-label"
				  value={selectedModel}
				  onChange={handleModelChange}
				  displayEmpty
				  fullWidth
				>
				  <MenuItem value=""><em>None</em></MenuItem>
				  {models.map(model => (
					<MenuItem key={model} value={model}>{model}</MenuItem>
				  ))}
				</Select>
			  </div>
			) : (
			  <div>
				<InputLabel id="year-select-label">Year</InputLabel>
				<Select
				  labelId="year-select-label"
				  id="year-select"
				  value={year}
				  onChange={handleYearChange}
				  fullWidth
				>
				  {[2020, 2016, 2012, 2008].map(yearOption => (
					<MenuItem key={yearOption} value={yearOption}>{yearOption}</MenuItem>
				  ))}
				</Select>
			  </div>
			)}
		  </FormControl>
		<Map
		  ref={mapRef}
		  initialViewState={{
			longitude: -98,
			latitude: 38,
			zoom: 3.7
		  }}
		  style={{ width: "100%", height: "100%" }}
		  mapStyle="mapbox://styles/mapbox/light-v10?optimize=true" // tried to make it less laggy idk if optimize works
		  mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
		  onMouseMove={handleMouseMove}
          onClick={handleMouseClick}
		>
		  {geoJsonData && (
			<Source type="geojson" data={geoJsonData}>
			  <Layer {...layerStyle} />
			  <Layer {...fillLayerStyle} />
			</Source>
		  )}
		  {popupInfo && (
			<Popup
			  longitude={popupInfo.longitude}
			  latitude={popupInfo.latitude}
			  closeButton={false}
			  closeOnClick={false}
			  anchor="top"
			>
			  <p><strong>Year: </strong>{popupInfo.details.year}</p>
			  <p><strong>County: </strong>{popupInfo.countyName}, {popupInfo.details.state_po}</p>
			  <p><strong>Average Annual Family Income: </strong>${popupInfo.details.avg_ann_income_family}</p>
			  <p><strong>Male: </strong>{popupInfo.details.males_percent}%</p>
			  <p><strong>Female: </strong>{popupInfo.details.females_percent}%</p>
			  <p><strong>Citizens: </strong>{popupInfo.details.citizen_percent}%</p>
			  <p><strong>Employed: </strong>{popupInfo.details.employed_percent}%</p>
			  <p><strong>Some college/Bachelor's: </strong>{popupInfo.details.some_college_or_bachelor_percent}%</p>
			  <p><strong>High School or Lower Education: </strong>{popupInfo.details.high_school_or_lower_education_percent}%</p>

			</Popup>
	
		  )
		  }
		</Map>

	  </div>

	);
  };
  
  export default MapPage;