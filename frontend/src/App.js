import React, { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes} from "react-router-dom";
import MapPage from "./MapPage";


const App = () => {


    //check to see if user login info is stored in local storage
	// useEffect(() => {
	// 	if (Object.keys(localStorage).includes("user")) {
	// 		setSignedIn(true);
	// 		setUser(JSON.parse(localStorage.getItem("user")));
	// 	}
	// }, []);

	// const handleSignIn = (currentUser) => {
	// 	setUser(currentUser);
	// 	setSignedIn(true);
	// 	localStorage.setItem("user", JSON.stringify(currentUser));
	// 	navigate("/profile");
	// };
	// const handleLogout = () => {
	// 	setUser(null);
	// 	setSignedIn(false);
	// 	localStorage.clear();
	// };

	// const handleRegisterSuccess = (user) => {
	// 	setUser(user);
	// 	setSignedIn(true);
	// 	localStorage.setItem("user", JSON.stringify(user));
	// 	navigate("/profile");
	// };

//landing page about the project
//map page
//login
//admin page to import data
//register account
//data page

	return (
		<>
			<Routes>
				<Route path="/" element={<MapPage/>} /> 
				<Route path="map" element={<></>} />
                <Route path="login" element={<></>} />
                <Route path="admin" element={<></>} />
                <Route path="register" element={<></>} />
                <Route path="data" element={<></>} />
			</Routes>
		</>
	);
};

export default App;
