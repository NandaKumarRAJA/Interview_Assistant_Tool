import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Divider,Stack,
  Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CardActions from '@mui/joy/CardActions';
 
import { Card, ButtonGroup,Alert, Button } from '@mui/joy';
 
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import proImage from '../assets/images/pro.jpg';
import Interview from '../assets/images/interview.png';
import { useMyContext } from './MyProvider';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
 
const ScheduleInterview = () => {
  const navigate = useNavigate();
  const { contextData } = useMyContext();
  const { candidateInfo } = contextData;
 
  const [interviewDetails, setInterviewDetails] = useState({
    JobId: candidateInfo.JobId,
    CandidateID: candidateInfo.CandidateID,
    InterviewStatus: 'Scheduled',
    InterviewDate: '',
    InterviewID: '1',
    Description: '',
    Attendees: [],
    fromTime: '',
    toTime: '',
    Platform: '',
  });
 
  const [showInputFields, setShowInputFields] = useState(false);
  const [newAttendee, setNewAttendee] = useState({
    name: '',
    position: '',
  });
  const profileStyle = {
    padding: '4px',
    textAlign: 'left',
    textWrap: 'wrap'
  }
  const inputFieldsRef = useRef();
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputFieldsRef.current && !inputFieldsRef.current.contains(event.target)) {
        setShowInputFields(false);
      }
    };
 
    document.addEventListener('click', handleClickOutside);
 
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
 
  const handleAddAttendee = () => {
    setInterviewDetails((prevDetails) => ({
      ...prevDetails,
      Attendees: [...prevDetails.Attendees, newAttendee],
    }));
    setNewAttendee({ name: '', position: '' });
    setShowInputFields(false);
  };
 
  const handlePlusIconClick = (event) => {
    event.stopPropagation();
    setShowInputFields(true);
  };
 
  const handleSubmit = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/interviews/', interviewDetails, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
 
      // Show toast message
      toast.success('Interview scheduled successfully', {
        position: 'top-right',
        autoClose: 3000, // 3 seconds
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
 
      // Reset the form
      setInterviewDetails({
        JobId: candidateInfo.jobId,
        CandidateID: candidateInfo.CandidateID,
        InterviewStatus: 'Scheduled',
        InterviewDate: '',
        InterviewID: '1',
        Description: '',
        Attendees: [],
        fromTime: '',
        toTime: '',
        Platform: '',
      });
    } catch (error) {
      console.error('Error storing Interview Info:', error);
    }
  };
 
  const handleDetailsChange = (field, value) => {
    if (field === 'date' || field === 'fromTime' || field === 'toTime') {
      setInterviewDetails((prevDetails) => ({
        ...prevDetails,
        [field]: value,
      }));
    } else {
      setInterviewDetails((prevDetails) => ({
        ...prevDetails,
        [field]: value,
      }));
    }
  };
 
  const handleClose = () => {
    navigate('/QAGeneration');
  };
 
  const underlineStyle = {
    borderBottom: '2px solid #000',
    display: 'inline',
  };
 
  return (
    <div>
      <Box display="flex" alignItems="center" marginLeft={10}>
        <Typography variant="h5" style={underlineStyle} fontWeight="light">
          Schedule Interview
          <img
            src={Interview}
            alt="Interview Icon"
            style={{ width: '40px', height: '40px', marginLeft: 15, marginTop: 13 }}
          />
        </Typography>
      </Box>
 
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-around"
        width="100%"
        marginTop="2rem"
      >
                <Card sx={{ width : '60%'}} variant='soft' color='primary'>
 
        <Box
          position="relative"
          p={6}
          flexGrow={1}
          maxWidth="100%"
          mb={2}
        >
          <IconButton
            style={{ position: 'absolute', top: '10px', right: '10px' }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
 
          <Typography variant="h6" display="flex" alignItems="center" color={'black'}>
            Attendees
            {interviewDetails.Attendees.map((attendee, index) => (
              <div key={attendee.name} style={{ display: 'flex', alignItems: 'center', marginLeft: '40px' }}>
                <Avatar src={proImage} alt={attendee.name} />
                <div style={{ marginLeft: '8px' }}>
                  <Typography variant="body4"  color={'black'}>{attendee.name} </Typography>
                  <Typography variant="body2" color="textSecondary" >
                    {attendee.position}
                  </Typography>
                </div>
                {index < interviewDetails.Attendees.length - 1 && <div style={{ marginLeft: '10px' }}></div>}
              </div>
            ))}
            {showInputFields && (
              <div ref={inputFieldsRef} style={{ display: 'flex', alignItems: 'center', marginLeft: '25px' }}>
                <TextField
                  size="small"
                  label="Name"
                  variant="outlined"
                  value={newAttendee.name}
                  onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
                  style={{ width: '120px', marginRight: '8px' }}
                />
                <TextField
                  size="small"
                  label="Position"
                  variant="outlined"
                  value={newAttendee.position}
                  onChange={(e) => setNewAttendee({ ...newAttendee, position: e.target.value })}
                  style={{ width: '120px' }}
                />
                <IconButton color="primary" onClick={handleAddAttendee}>
                  <AddIcon />
                </IconButton>
              </div>
            )}
            {!showInputFields && (
              <IconButton color="primary" onClick={handlePlusIconClick}>
                <AddIcon />
              </IconButton>
            )}
          </Typography>
 
          <Box display="flex" flexDirection="row" mt={3} alignItems="center">
            <Typography variant="h6"  color={'black'}>When</Typography>
 
            <Box display="flex" flexDirection="row" alignItems="center" marginLeft={10}>
              <TextField
                type="date"
                variant="outlined"
                size="small"
                style={{ width: '150px', marginRight: '70px' }}
                value={interviewDetails.InterviewDate}
                onChange={(e) => handleDetailsChange('InterviewDate', e.target.value)}
              />
 
              <TextField
                type="time"
                variant="outlined"
                size="small"
                style={{ width: '125px', marginRight: '10px' }}
                value={interviewDetails.fromTime}
                onChange={(e) => handleDetailsChange('fromTime', e.target.value)}
              />
 
              <Typography variant="body1"  color={'black'} style={{ marginRight: '10px' }}>to</Typography>
 
              <TextField
                type="time"
                variant="outlined"
                size="small"
                style={{ width: '125px' }}
                value={interviewDetails.toTime}
                onChange={(e) => handleDetailsChange('toTime', e.target.value)}
              />
            </Box>
          </Box>
 
          <Typography variant="h6"   color={'black'} mt={3}>Platform</Typography>
          <TextField
            select
            variant="outlined"
            fullWidth
            value={interviewDetails.Platform}
            onChange={(e) => handleDetailsChange('Platform', e.target.value)}
          >
            <MenuItem value="Microsoft Teams">Microsoft Teams</MenuItem>
            <MenuItem value="Cisco Webex">Cisco Webex</MenuItem>
            <MenuItem value="Google Meet">Google Meet</MenuItem>
          </TextField>
 
          <Typography variant="h6" color={'black'} mt={3}>Details</Typography>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={interviewDetails.Description}
            onChange={(e) => handleDetailsChange('Description', e.target.value)}
          />
        </Box>
        </Card>
 
        <Card sx={{ display: 'flex', width: '30%', height: '100%' }} variant='soft' color='neutral'>
          <Card variant='soft' color='white' sx={{ display: 'flex', width: '93%', height: '60%', fontFamily: 'sans-serif' }}>
            <Stack flexDirection={'Column'} alignItems={'center'} justifyContent={'space-around'}>
              <PersonIcon sx={{ fontSize: 100, padding: 0 }} color='action' />
 
              {candidateInfo && (
                <table style={profileStyle}>
                  <tr>
                    <th>Email :</th>
                    <td><Typography>{candidateInfo.Email}</Typography></td>
                  </tr>
                  <tr>
                    <th>Experience :</th>
                    <td><Typography>{candidateInfo.TotalExperience}</Typography></td>
                  </tr>
                  <tr>
                    <th>Location :</th>
                    <td><Typography>{candidateInfo.CurrentLocation}</Typography></td>
                  </tr>
                  <tr>
                    <th>Phone :</th>
                    <td><Typography>{candidateInfo.PhoneNO}</Typography></td>
                  </tr>
                </table>
 
              )}
            </Stack>
          </Card>
 
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Divider light />
            <CardActions sx={{ alignSelf: 'center' }}>
              {/* <ButtonGroup variant='soft' color='neutral' > */}
                <Button onClick={handleClose}   variant="solid"
                      color="danger"
                      sx={{ backgroundColor: '#F15A59', color: 'white' }}>
 
                  Cancel
                </Button>
 
                <Button  variant='solid' color='success' sx={{ backgroundColor: '#C5E86C', color: 'white' }} mt={2} onClick={handleSubmit}>
                  Confirm
                </Button>
              {/* </ButtonGroup> */}
            </CardActions>
          </Box>
        </Card>
        <ToastContainer />
        </Box>
 
    </div>
  );
};
 
export default ScheduleInterview;