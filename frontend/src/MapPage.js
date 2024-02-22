import React, { useState, useEffect } from "react";
import { Route, Routes} from "react-router-dom";
import { Map, FullscreenControl, Popup, Marker } from "react-map-gl";


const MapPage = () => {


	return (
		<div width="100" height="100">
            <Map mapboxAccessToken="pk.eyJ1IjoicGllcnJldHJhbnZhIiwiYSI6ImNsb21hc2EwdzBxdzAya29hOW93ODdvZzAifQ.sEo9dei56DzcmmuKrCPd0Q"></Map>
		</div>
	);
};

export default MapPage;
