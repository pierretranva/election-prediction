import * as React from 'react';
import {useState} from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';

export default function NavBar({toggleSidebar, isLogin}) {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ textAlign: 'center', flexGrow: 1 }}>
            2024 Presidential Election Prediction
          </Typography>
          {!isLogin ? <Button color="inherit" component={Link} to="/login">
          Login
          </Button> :  <IconButton sx={{ p: 0 }}>
                <Avatar alt="User" />
              </IconButton>
            }
        </Toolbar>
      </AppBar>
    </Box>
  );
}
