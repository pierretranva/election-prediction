import React, { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import MapPage from "./MapPage";
import LoginPage from "./Login";
import RegisterPage from "./Register";
import NavBar from "./Navbar";
import Sidebar from "./Sidebar";
import AboutUs from "./AboutUs";
import ImportPage from "./ImportPage";
import Trends from "./Trends";


const App = () => {

    const [signedIn, setSignedIn] = useState(false);
    const [user, setUser] = useState(null);
	const navigate = useNavigate();


    //check to see if user login info is stored in local storage
	useEffect(() => {
		if (Object.keys(localStorage).includes("user")) {
			setSignedIn(true);
			setUser(JSON.parse(localStorage.getItem("user")));
		}
	}, []);

	const handleSignIn = (currentUser) => {
        // console.log("SFSFSD")
		setUser(currentUser);
		setSignedIn(true);
		localStorage.setItem("user", JSON.stringify(currentUser));
		navigate("/map");
	};
	const handleLogout = () => {
        if (signedIn) {
            setSignedIn(false)
            setUser(null);
		    localStorage.clear();
        }
        else{
            console.log("User not signed in")
        }
		
	};

	const handleRegisterSuccess = (user) => {
		setUser(user);
		setSignedIn(true);
		localStorage.setItem("user", JSON.stringify(user));
		navigate("/map");
	};

//landing page about the project
//map page
//login
//admin page to import data
//register account
//data page
const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

	return (
		<>
        <NavBar toggleSidebar={toggleSidebar} isLogin={signedIn} ></NavBar>
        <Sidebar toggleSidebar={toggleSidebar} handleLogout={handleLogout} isOpen={sidebarOpen} onClose={toggleSidebar} />
			<Routes>
				<Route path="/" element={<AboutUs/>} /> 
				<Route path="map" element={<MapPage/>} />
                <Route path="login" element={<LoginPage loggedIn={signedIn} signIn={handleSignIn}  />} />
                <Route path="admin" element={<ImportPage loggedIn={signedIn} user={user}/>} />
                <Route path="register" element={<RegisterPage handleRegister={handleRegisterSuccess}/>} />
                <Route path="data" element={<></>} />
				<Route path="trends" element={<Trends/>} />
				<Route path="about-us" element={<AboutUs/>} />
				<Route path="trends/:countyFIPS/:countyName" element={<Trends/>}/>
			</Routes>
		</>
	);
};

export default App;