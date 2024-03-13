import React, { useState, useEffect, useRef} from "react";
import { Route, Routes} from "react-router-dom";
import { Map, FullscreenControl, Popup, Marker, Source, Layer } from "react-map-gl";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import counties from './counties.geojson';
import NavBar from "./Navbar";
import Sidebar from "./Sidebar";

const MapPage = () => {
	const [data, setData] = useState(counties);
	const [popupInfo, setPopupInfo] = useState(null);
	const mapRef = useRef(null);
  
	const layerStyle = {
	  id: 'county-boundaries',
	  type: 'line',
	  paint: {
		'line-width': 0.8,
		'line-color': '#a0a0a0',
	  },
	};

	const fillLayerStyle = {
		id: 'county-fill',
		type: 'fill',
		paint: {
		  'fill-color': '#90ee90',
		  'fill-opacity': 0.2,
		},
	  };
  
	const handleMouseMove = (e) => {
        if(mapRef.current === null) return;
	  const map = mapRef.current.getMap(); // get map instance
	  const features = map.queryRenderedFeatures(e.point, { layers: ['county-fill'] });
	  if (features.length > 0) {
		const feature = features[0];
		setPopupInfo({
		  countyName: feature.properties.NAME, // "NAME" property for the county name
		  longitude: e.lngLat.lng,
		  latitude: e.lngLat.lat,
		});
	  } else {
		setPopupInfo(null); // clear popup info when not hovering over a feature
	  }
	};
  
	const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

	return (
	  <div style={{ width: "100vw", height: "100vh" }}>
		<NavBar toggleSidebar={toggleSidebar}></NavBar>
        <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
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
			  {popupInfo.countyName}
			</Popup>
		  )}
		</Map>
	  </div>
	);
  };
  
  export default MapPage;
