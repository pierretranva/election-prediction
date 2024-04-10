import React, { useState, useEffect, useRef} from "react";
import { Route, Routes} from "react-router-dom";
import { Map, FullscreenControl, Popup, Marker, Source, Layer } from "react-map-gl";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import counties from './counties.geojson';
import axios from 'axios';


const MapPage = () => {
	const [data, setData] = useState();
	const [popupInfo, setPopupInfo] = useState(null);
    const [year, setYear] = useState(2020);
    const [predictions, setPredictions] = useState([]); 
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
	const mapRef = useRef(null);
    useEffect(() => {
        const interval = setInterval(() => {
            setYear(prevYear => {
                if (prevYear === 2022) {
                    return 2008; // Reset to start year if it reaches 2022
                } else {
                    return prevYear + 1; // Increment year
                }
            });
        }, 1000); // Interval duration in milliseconds

        return () => clearInterval(interval); // Cleanup function to clear interval on component unmount
    }, []);

    useEffect(() =>{
        
        const fetchData = async () => {
        let res = await axios({
            method: 'get',
            url: 'http://localhost:3000/db/counties/'+ year.toString(),
        })
        setData(res.data)
        let paintLayerArray = ['match', ['get', 'GEOID']]
        res.data.map((county) => {
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
}, [year]);

    useEffect(() =>{
        // console.log("useEffect")
        axios({
            method: 'get',
            url: 'http://localhost:3000/db/geojson',
          })
            .then((response) => {
                setData(response.data[0])
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

	const handleMouseMove = async (e) => {
		if (!mapRef.current) return;
		const map = mapRef.current.getMap();
		const features = map.queryRenderedFeatures(e.point, { layers: ['county-fill'] });
		if (features.length > 0) {
			const feature = features[0];
			const countyFIPS = feature.properties.GEOID;
			try {
				let url = `http://localhost:3000/db/county/${countyFIPS}?year=${year}`;
				let response = await axios.get(url);
				if (response.data && response.data.length > 0) {
					const detailsForYear = response.data[0];
					setPopupInfo({
						details: detailsForYear,
						longitude: e.lngLat.lng,
						latitude: e.lngLat.lat,
						countyName: feature.properties.NAME,
					});
				} else {
					setPopupInfo(null);
				}
			} catch (error) {
				console.error("Failed to fetch county details", error);
				setPopupInfo(null);
			}
		} else {
			setPopupInfo(null);
		}
	};
	
	  
	return (
	  <div style={{ width: "100vw", height: "100vh" }}>
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
		  {data && (
			<Source type="geojson" data={data}>
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
