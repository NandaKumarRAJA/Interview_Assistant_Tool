import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import FlakyIcon from '@mui/icons-material/Flaky';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import kaniniImage from '../assets/images/kanini-logo.svg';
import { Link as JoyLink } from '@mui/joy';

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("Role");
    sessionStorage.removeItem("email");
    handleMenuClose();
    window.location.reload();
  };

  return (
    <AppBar variant='elevation' position='static' elevation={4} sx={{ backgroundColor: '#0077C8' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Stack flexDirection={'row'} justifyContent={'space-evenly'} sx={{ width: '80%' }}>
          <img src={kaniniImage} alt="Kanini" style={{ width: '120px', height: '30px', marginRight: '10px' }} />
            <Link
              to="/Home">
              <JoyLink
              sx={{color: 'white', backgroundColor:'#0077C8', width:'100%', height:'30px', borderRadius:'10px'}}
              startDecorator={<HomeIcon/>}
              level='title-lg'
              underline='none'
              variant='solid'
              >Home</JoyLink>
            </Link>
            <Link
              to="/Candidate"
              ><JoyLink
              sx={{color: 'white', backgroundColor:'#0077C8', width:'100%', height:'30px', borderRadius:'10px'}}
              startDecorator={<PersonPinIcon/>}
              level='title-lg'
              underline='none'
              variant='solid'
              >Candidate</JoyLink>
          
            </Link>
            <Link
              to="/Resume"
             ><JoyLink
             sx={{color: 'white', backgroundColor:'#0077C8', width:'100%', height:'30px', borderRadius:'10px'}}
             startDecorator={<EventNoteIcon />}
             level='title-lg'
             underline='none'
             variant='solid'
             >Resume</JoyLink>
            
              
            </Link>
            <Link
              to="/QAGeneration"
              ><JoyLink
              sx={{color: 'white', backgroundColor:'#0077C8', width:'100%', height:'30px', borderRadius:'10px'}}
              startDecorator={<SettingsSuggestIcon/>}
              level='title-lg'
              underline='none'
              variant='solid'
              >QA Generation</JoyLink>
           
              
            </Link>
            <Link
              to="/InterviewVerdict"
            ><JoyLink
            sx={{color: 'white', backgroundColor:'#0077C8', width:'100%', height:'30px', borderRadius:'10px'}}
            startDecorator={<FlakyIcon/>}
            level='title-lg'
            underline='none'
            variant='solid'
            >Interview Verdict</JoyLink>
       
              
            </Link>
            <Link
              to="/Login"
             
              
              onClick={handleLogout}>
                <JoyLink
              sx={{color: 'white', backgroundColor:'#0077C8', width:'100%', height:'30px', borderRadius:'10px'}}
              startDecorator={<ExitToAppIcon/>}
              level='title-lg'
              underline='none'
              variant='solid'
              >Logout</JoyLink>
          
              
            </Link>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;