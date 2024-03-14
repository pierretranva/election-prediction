// Sidebar.js

import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <Drawer open={isOpen} onClose={onClose}>
      <List className="sidebar-list">
        <ListItem className="sidebar-item">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem className="sidebar-item">
          <ListItemText primary="About" />
        </ListItem>
        <ListItem className="sidebar-item">
          <ListItemText primary="Contact" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;
