import { Box, IconButton, useTheme, Button, TextField, Typography } from "@mui/material";
import { useContext, useCallback } from "react";
import { ColorModeContext, tokens } from "../../theme";
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import * as constants from '../../constants/routes';

// Icons
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LoginIcon from '@mui/icons-material/Login';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Topbar = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  return (
    <div style={{ 
                position: 'fixed',
                display: "flex", 
                width: props.isCollapsed ? '96%' : '90%',
                transition: "width 0.3s ease",
                justifyContent: "space-between", 
                alignItems: 'center',
                paddingTop: "15px", 
                zIndex: 1000, 
                paddingBottom: "10px", 
                paddingRight: "100px",
                borderBottom: `1px solid ${colors.primary[300]}`,
                backgroundColor: theme.palette.mode === "dark" ? colors.primary[200] : colors.primary[100],
                opacity: 0.9
            }}
    >
        {/* Website Name */}
        <Box ml="30px">
            <Typography variant="h2">L E S S O N C R A F T</Typography>
        </Box>
        
        
        {/* Icons */}
        <Box display="flex" justifyContent="space-between" mr="30px">

            {props.user ? (
                    <>

                        <Button component={Link} to="/create" variant="outlined" startIcon={<AddCircleOutlineIcon />} color="secondary" style={{borderRadius: 20, marginRight: "20px", color: colors.blueAccent[100], boxShadow: 'none'}}>
                            Create
                        </Button>
                       
                        
                        {/* <IconButton size="large" color="secondary" onClick={()=> navigate('/profile')} data-testid = "PersonOutlinedIcon">
                            <PersonOutlinedIcon/>
                        </IconButton> */}

                        <IconButton size="large" color="secondary" onClick={() => navigate(`/profile/${props.user.firstName}-${props.user.lastName}`)} data-testid="PersonOutlinedIcon">
                            <PersonOutlinedIcon />
                        </IconButton>
                                        

                        <IconButton size="large" color="secondary" onClick={()=> navigate('/setting')}>
                            <SettingsOutlinedIcon/>
                        </IconButton>

                        {/* <IconButton size="large" color="secondary">
                            <NotificationsOutlinedIcon/>
                        </IconButton> */}
                    </>
                )
                :
                (
                    <>
                        <Button component={Link} to="/signin" variant="outlined" startIcon={<LoginIcon />} color="secondary" style={{borderRadius: 20, marginRight: "20px", color: colors.blueAccent[100], boxShadow: 'none',}}>
                            Sign in
                        </Button>
                        <Button component={Link} to="/signup" variant="outlined" startIcon={<LockOpenIcon />} color="secondary" style={{borderRadius: 20, marginRight: "20px", color: colors.blueAccent[100], boxShadow: 'none'}}>
                            Register
                        </Button>
                    </>
                )
            }

            {/* COLOR MODE */}
            <IconButton onClick={colorMode.toggleColorMode} size="large" color="secondary">
                {theme.palette.mode === "dark" ? (
                    <DarkModeIcon/>
                ) : (
                    <LightModeIcon/>
                )}
            </IconButton>
        </Box>
    </div>

  );
};

export default Topbar;