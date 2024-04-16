// Sidebar.js

import React from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";

const pages = [
	{ name: "Map", link: "/map" },
	{ name: "Trends", link: "/trends" },
	{ name: "Login", link: "/login" },
	{ name: "About Us", link: "/about-us"},
    { name: "Upload File", link: "/admin" },
];
const Sidebar = ({ toggleSideBar, handleLogout, isOpen, onClose }) => {
	return (
		<Drawer open={isOpen} onClose={onClose}>
			<List className="sidebar-list" >
				{pages.map((page) => (
					<ListItem key={page.name}  className="sidebar-item">
						<NavLink to={page.link} onClick={toggleSideBar}>
							<ListItemText primary={page.name} />
						</NavLink>
					</ListItem>
				))}
                <ListItem className="sidebar-item" onClick={handleLogout}>
                    <NavLink to={"/map"}>
                        <ListItemText primary="Logout" />
                    </NavLink>
                </ListItem>
			</List>
		</Drawer>
	);
};

export default Sidebar;