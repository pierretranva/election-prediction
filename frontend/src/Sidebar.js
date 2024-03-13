// Sidebar.js

import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <Drawer open={isOpen} onClose={onClose}>
      <List>
        <ListItem button>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="About" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Contact" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;
