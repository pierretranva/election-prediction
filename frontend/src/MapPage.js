import React, { useState, useEffect, useRef} from "react";
import { Route, Routes} from "react-router-dom";
import { Map, FullscreenControl, Popup, Marker, Source, Layer } from "react-map-gl";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import counties from './counties.geojson';
import axios from 'axios';
import { Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';


const MapPage = () => {
	const [data, setData] = useState([]);
	const [geoJsonData, setGeoJsonData] = useState([]);
	const [popupInfo, setPopupInfo] = useState(null);
    const [year, setYear] = useState(2020);
	const mapRef = useRef(null);
    const [predictions, setPredictions] = useState([]); 
	const [countyDataCache, setCountyDataCache] = useState({});
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

	useEffect(() =>{
        const fetchData = async () => {
		let currentData;
		if (countyDataCache[year]) {
			currentData = countyDataCache[year];
			setData(currentData);
		} 
		else {
			let res = await axios({
				method: 'get',
				url: 'http://localhost:3000/db/counties/'+ year.toString(),
			})
            currentData = res.data;
            setCountyDataCache(prev => ({ ...prev, [year]: currentData }));
            setData(currentData);
		}	
        let paintLayerArray = ['match', ['get', 'GEOID']]
        currentData.map((county) => {
            if(county.winner === 0){
            paintLayerArray.push(county.state_county.toString(), 'blue')
            }
            else{
                paintLayerArray.push(county.state_county.toString(), 'red')
            }
        })
        paintLayerArray.push('grey')
        setFillLayerStyle({...fillLayerStyle, paint: {'fill-color': paintLayerArray, 'fill-opacity': 0.2}});

    }
    console.log(year)
    fetchData();
}, [year, countyDataCache]);

    useEffect(() =>{
        // console.log("useEffect")
        axios({
            method: 'get',
            url: 'http://localhost:3000/db/geojson',
          })
            .then((response) => {
                setGeoJsonData(response.data[0])
            });
    }
    ,[])
  
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
			const detailsForYear = data.find(county => county.state_county.toString() === countyFIPS);
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
	
	
	const handleYearChange = (e) => {
		setYear(e.target.value);
	  };
	  

	return (
		<div style={{ width: "100vw", height: "95vh"}}>
		<FormControl 
		  variant="outlined" 
		  sx={{ 
			position: 'absolute', 
			top: '3%', 
			left: '20%', 
			minWidth: 120, 
			'.MuiOutlinedInput-root': { 
			  color: 'white', 
			  '& fieldset': { borderColor: 'white' }, 
			  '&:hover fieldset': { borderColor: 'white' }, 
			  '&.Mui-focused fieldset': { borderColor: 'white' }, 
			},
			'.MuiInputLabel-root': { 
			  color: 'white', 
			  '&.Mui-focused': { color: 'white' }
			},
		  }}
		>
		  <InputLabel id="year-select-label" shrink htmlFor="year-select">
			Year
		  </InputLabel>
		  <Select
			labelId="year-select-label"
			id="year-select"
			value={year}
			onChange={handleYearChange}
			label="Year"
			renderValue={(selected) => `${selected}`}
			sx={{
			  '& .MuiSelect-select': { 
				color: 'white', 
				paddingTop: '5px', // Decrease top padding
				paddingBottom: '5px', // Decrease bottom padding
				paddingLeft: '5px', // Adjust left padding as needed
				paddingRight: '5px', // Adjust right padding as needed
				'&:focus': { backgroundColor: "transparent" }
			  },
			  '.MuiSvgIcon-root': { color: 'white' }
			}}
		  >
			{[...Array((2020 - 2008) / 4 + 1)].map((_, i) => (
			  <MenuItem key={i} value={2008 + i * 4}>
				{2008 + i * 4}
			  </MenuItem>
			))}
		  </Select>
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
		  mapboxAccessToken="pk.eyJ1IjoiYnJ5YW50cmFudiIsImEiOiJjbHN4d2ZuNmswN2pzMmtvMjl2dXV0enhoIn0.HDphbK-ps-z2N3sjQbiDaQ"
		  onMouseMove={handleMouseMove}
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
			  <p><strong>County: </strong>{popupInfo.countyName}</p>
			  <p><strong>Average Annual Family Income: </strong>${popupInfo.details.avg_ann_income_family}</p>
			  <p><strong>Male: </strong>{popupInfo.details.males_percent}%</p>
			  <p><strong>Female: </strong>{popupInfo.details.females_percent}%</p>
			  <p><strong>Citizens: </strong>{popupInfo.details.citizen_percent}%</p>
			  <p><strong>Employed: </strong>{popupInfo.details.employed_percent}%</p>
			  <p><strong>Some college/Bachelor's: </strong>{popupInfo.details.some_college_or_bachelor_percent}%</p>
			  <p><strong>High School or Lower Education: </strong>{popupInfo.details.high_school_or_lower_education_percent}%</p>
			</Popup>
		  )}
		</Map>
	  </div>
	);
  };
  
  export default MapPage;