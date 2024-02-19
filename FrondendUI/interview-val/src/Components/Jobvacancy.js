import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import logo from '../assets/images/kanini.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Chip, Button, Autocomplete, Badge, Stack } from '@mui/joy';

const gridItemStyle = {
  height: '100%',
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ContentPage = ({ roleDetails, onCancel }) => {


  return (
    <div>
      <Typography variant="h5" fontWeight={700}>Job Title : {roleDetails.jobTitle}</Typography>
      <Typography variant="body1">
        <Chip color='primary' variant='soft' sx={{ width: '20%', height: '30px', margin: '10px' }}>
          <p><b>Scope:</b></p>
        </Chip>
        <div>{roleDetails.scope}</div>
      </Typography>

      <Typography variant="body1">
        <Chip color='primary' variant='soft' sx={{ width: '20%', height: '30px', margin: '10px' }}>
          <p><b>Job Description :</b></p>
        </Chip>
        <div >{roleDetails.description}</div>
      </Typography>

      <Typography variant="body1">
        <Chip color='primary' variant='soft' sx={{ width: '20%', height: '30px', margin: '10px' }}>
          <p><b>Responsibilities:</b></p>
        </Chip>
        <div >{roleDetails.responsibility}</div>
      </Typography>

      <Typography variant="body1">
        <Chip color='primary' variant='soft' sx={{ width: '20%', height: '30px', margin: '10px' }}>
          <p><b>You bring in :</b></p>
        </Chip>
        <div>{roleDetails.bringsIn}</div>
      </Typography>

      <Typography variant="body1">
        <Chip color='primary' variant='soft' sx={{ width: '20%', height: '30px', margin: '10px' }}>
          <p><b>Qualification:</b></p>
        </Chip>
        <div >{roleDetails.qualification}</div>
      </Typography>
    </div>
  );
};

function JobVacancy() {
  const [selectedJobRole, setSelectedJobRole] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [selectedJobData, setSelectedJobData] = useState(null)
  const role = sessionStorage.getItem('Role');
  const isAdmin = role && role === 'admin';
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/Job_Details')
      .then(response => {
        setJobTitles(response.data);
      })
      .catch(error => {
        console.error('Error fetching job titles:', error);
      });
  }, []);

  const handleRoleClick = async () => {
    try {
      console.log(selectedJobRole)
      const response = await axios.get(`http://127.0.0.1:8000/Job_Description/${selectedJobRole}`)
      console.log(response)
      setSelectedJobData(response.data)
    }
    catch (error) {
      console.error(`Error fetching details for role ${selectedJobRole}:`, error);
    };
  };
  const handleJobRoleChange = (event, newValue) => {
    setSelectedJobRole(newValue);
  };
  const underlineStyle = {
    borderBottom: '2px solid #000',
    display: 'inline',
  };

  const handleCancel = () => {
    setSelectedJobData(null);
  };

  return (
    <div>
      <Container>
        <Box display="flex" alignItems="center" marginBottom={4} textAlign={'center'}>
          <Stack flexDirection={'row'} alignItems={'flex-start'} position={'relative'} width={'50%'} right={'90px'}>

            <Typography variant="h5" marginLeft={10} style={underlineStyle} marginTop={2} >
              Jobs
              <FindInPageIcon />

            </Typography>
          </Stack>

          <Box
            position="absolute"
            top={80}
            right={0}
            padding={2}
            width={150}
          >
        {isAdmin && (
            <Link to="/AddJob" style={{ textDecoration: 'none' }}>
             
              <Button variant='solid' color='success' startDecorator={<PersonAddAlt1Icon />}>Add Job</Button>
            </Link>
        )}

          </Box>
        </Box>
      </Container>

      <Grid container spacing={2}>
        <Grid item xs={4}>



          <Card variant='soft' color='primary' sx={{ height: '430px', width: '80%', alignItems: 'center', justifyContent: 'center' }}>
            <Card variant='solid' color='white' sx={{ width: '80%', height: '85%', position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
              <Autocomplete
                id="job-role-selection"
                placeholder="Job Role"
                options={jobTitles.map((jobTitle) => jobTitle.jobTitle)}
                getOptionLabel={(option) => option}
                value={selectedJobRole}
                onChange={handleJobRoleChange}
                renderTags={(tags) => (
                  <Badge badgeContent={tags.length} color="primary" sx={{ width: '100%', color: 'darkorchid' }} variant='standard'>
                    <Chip variant="plain" sx={{ width: '100%' }}>{tags.join(', ')}</Chip>
                  </Badge>
                )}
                variant='soft'
                color='neutral'
                popupIcon={<KeyboardArrowDownIcon />}
                sx={{ height: '45px', width: '100%' }}
              />
              <Button onClick={() => handleRoleClick()}>filter</Button>

            </Card>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Card variant='soft' color='neutral' sx={{ width: '93%', height: '95%' }}>

            {selectedJobData !== null ? (
              <ContentPage roleDetails={selectedJobData} onCancel={handleCancel} />
            ) : (
              <Item>
                <div>
                  <Grid container spacing={2} height={450} >
                    <Grid item xs={12}>
                      <Paper style={{ padding: 16, display: 'flex', alignItems: 'center', height: '200px' }}>
                        <div style={{ flex: 1 }}>
                          <Typography variant="h6">Explore our open position</Typography>
                          <Typography variant="body1">
                            At KANINI, we are building a more human tech. Our operating principle is that technology is for people, not the other way around. That means we put our people's needs first.
                          </Typography>
                        </div>
                        <Box marginLeft={2}>
                          <img src={logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={4} style={gridItemStyle} marginTop={3}>
                      <Paper style={{ padding: 16, marginTop: 4, borderRadius: 16, backgroundColor: '#e0e0e0', height: '110px' }}>
                        <Typography variant="h6">Integrity</Typography>
                        <Typography variant="body1">We trust each other and our successes are a result of transparency and honesty.</Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={4} style={gridItemStyle} marginTop={3}>
                      <Paper style={{ padding: 16, marginTop: 5, borderRadius: 16, backgroundColor: '#e0e0e0', height: '110px' }}>
                        <Typography variant="h6">Delivery</Typography>
                        <Typography variant="body1">The timeline we set is realistic, so we always deliver on time.</Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={4} style={gridItemStyle} marginTop={3}>
                      <Paper style={{ padding: 16, marginTop: 5, borderRadius: 16, backgroundColor: '#e0e0e0', height: '100px' }}>
                        <Typography variant="h6">Humility</Typography>
                        <Typography variant="body1">Our leadership is down to earth and always willing to listen and change.</Typography>
                      </Paper>
                    </Grid>


                  </Grid>

                </div>
              </Item>
            )}
          </Card>

        </Grid>
      </Grid>

    </div>
  );
}

export default JobVacancy;