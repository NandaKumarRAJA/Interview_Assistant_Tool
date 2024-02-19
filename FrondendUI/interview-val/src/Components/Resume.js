import React, { useState, useEffect, useRef } from 'react';
import { CircularProgress } from '@mui/material';
import {FormControlLabel, Typography, Box, Grid, Divider, Stack, Checkbox} from '@mui/material';
import { ButtonGroup, Chip, Card, CardContent, CardActions, Button, IconButton, Input } from '@mui/joy';
import ResumeIcon from '../assets/images/resumeIcon.svg'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { OpenAIIconUnchecked, OpenAIIconChecked } from '../icons/openAIIcon';
import { MetaIconChecked, MetaIconUnchecked } from '../icons/metaIcon';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import Snackbar from '@mui/joy/Snackbar';
import ErrorIcon from '@mui/icons-material/Error';
import { LinearProgress } from '@mui/joy';
import { ThumbDownSharp, ThumbUpSharp } from '@mui/icons-material';
import { Alert } from '@mui/joy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Resume = () => {
  const [candidateProfile, setCandidateProfile] = useState({
    CandidateID: '',
    FirstName: '',
    PhoneNO: '',
    CurrentLocation: '',
    Email: '',
    DOB: '',
    DOJ: '',
    JobId: '',
    Address: '',
    TotalExperience: '',
    LastName: '',
    LinkinID: '',
    Resume: '',
  });


  const [error, setError] = useState({ error: false, detail: '' });
  const [status, setStatus] = useState({ success: false, error: false, message: '' })
  const handleClose = () => {
    setError({ error: false, detail: '' })
  };

  const closeNotification = () => {
    setStatus({ status: false, error: false, message: '' })
  }

  const [loading, setLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showValidationResult, setShowValidationResult] = useState({
    ValidationRunId: '',
    CandidateID: '',
    Timestamp: '',
    ValidationResultScore: '',
    Explanation: '',
    ValidationStatus: '',
    top_skills_matching: [],
    job_title: '',
    missing_skills: '',
  });

  const [searchCandidate, setSearchCandidate] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState({
    CandidateID: '',
    FirstName: '',
    PhoneNO: '',
    CurrentLocation: '',
    Email: '',
    DOB: '',
    DOJ: '',
    JobId: '',
    Address: '',
    TotalExperience: '',
    LastName: '',
    LinkinID: '',
    Resume: ''
  });
  const [selectedModel, setSelectedModel] = useState('');

  const handleModelSelection = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleValidationResult = async () => {
    try {
      let response;

      if (selectedModel === 'OpenAI') {
        const JDResponse = await axios.get(`http://127.0.0.1:8000/Job_Details/${candidateProfile.JobId}`);
        response = await axios.post(
          `http://127.0.0.1:8000/Resume_Validation_OpenAI?job_data=${JDResponse.data}&resume_path=${filteredCandidates.Resume}&candidate_id=${filteredCandidates.CandidateID}&job_id=${filteredCandidates.JobId}`
        );
      } else if (selectedModel === 'LLMA-2') {
        const JDResponse = await axios.get(`http://127.0.0.1:8000/Job_Details/${candidateProfile.JobId}`);
        response = await axios.post(
          `http://127.0.0.1:8000/ResumeValidationUsingLLAMA-2?Job_Description=${JDResponse.data.description}&resume_path=${candidateProfile.Resume}&CandidateId=${candidateProfile.CandidateID}&job_id=${filteredCandidates.JobId}`
        );
      }
      setShowValidationResult(response.data);
      setStatus({ success: true, error: false, message: 'Resume validated successfully' })
    } catch (error) {
      setStatus({ success: false, error: true, message: 'Resume validation failed' })

    } finally {
    }
  };
  const handleValidation = async () => {
    setLoading(true);
    try {
      await handleValidationResult();
      setShowValidation(!showValidation);
    } finally {
      setLoading(false); // Set loading to false when validation is complete
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  const profileStyle = {
    padding: '4px',
    textAlign: 'left',
    textWrap: 'wrap'
  }
  const underlineStyle = {
    borderBottom: '2px solid #000',
    display: 'inline',
  };


  const handleReloadPage = () => {
    window.location.reload();
  };

  const handleSearchClick = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/candidates/${searchCandidate}`);
      setFilteredCandidates(response.data);
      setStatus({ success: true, error: false, message: 'Profile fetched successfully' })
    } catch (error) {
      setStatus({ success: false, error: true, message: 'Error fetching profile' })

    } finally {
    }
  };
  const handleSearchChange = (event) => {
    setSearchCandidate(event.target.value);
  };
  return (
    <div >
      <Stack flexDirection={'column'} sx={{ padding: '10px' }} spacing={3}>
        <Grid container>
          <Grid item xs={4}>
            <Stack flexDirection={'row'} alignItems={'flex-start'} position={'relative'} width={'50%'} left={'50px'}>
              <Typography variant="h5" style={underlineStyle} fontWeight="light">
                Resume
                <img src={ResumeIcon} width={40} height={40} style={{ padding: '5px', paddingBottom: 0 }} />
              </Typography>
            </Stack>
          </Grid>
          <Grid xs={6}>
            <Input id='search-candidate' placeholder='Search Candidate' type='search'
              startDecorator={<PersonSearchIcon color='info' />}
              onChange={handleSearchChange}
              endDecorator={<Button variant='soft' sx={{ height: '40px' }} onClick={handleSearchClick}>Search</Button>}
              sx={{ width: '50%', height: '40px', alignSelf: 'center', position: 'relative', top: '10px' }} variant='soft' color='primary' />
          </Grid>
        </Grid>
        <Stack width={'100%'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
          <Card variant='soft' color='primary' sx={{ height: '400px', width: '60%', alignItems: 'center', marginLeft: '2%', justifyContent: 'center' }}>
            {
              loading ?
                <Card variant='plain' sx={{ width: '45%', height: '90%', color: '#25282A' }}>
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress color="primary" />
                  </Box>
                </Card>
                :
                (!showValidation ? (
                  <Alert variant='soft' color='warning' sx={{ width: '50%', textAlign: 'center' }} startDecorator={<ErrorIcon color='error' />}>Search Candidate to Validate Resume</Alert>
                ) :
                  <Card color='white' variant='solid' sx={{ width: '70%', height: '90%', display: 'flex', justifyContent: 'space-evenly' }}>
                    <Typography variant="h6" textAlign={'center'}>Validation Result</Typography>
                    <Box display="flex" alignItems="center">
                      <IconButton sx={{ position: 'absolute', left: '90%', top: '0px' }} onClick={handleReloadPage}>
                        <CloseIcon ></CloseIcon>
                      </IconButton>
                    </Box>
                    <Stack flexDirection={'row'} justifyContent={'space-between'}>
                      <Typography sx={{ fontWeight: '700' }}> Score:</Typography>
                      <LinearProgress
                        determinate
                        variant="solid"
                        color={showValidationResult.ValidationResultScore < 50 ? 'danger' : 'success'}
                        size="sm"
                        thickness={18}
                        value={showValidationResult.ValidationResultScore}
                        sx={{
                          '--LinearProgress-radius': '20px',
                          '--LinearProgress-thickness': '22px',
                        }}
                      >
                        <Typography
                          level="body-xs"
                          fontWeight="xl"
                          color={showValidationResult.ValidationResultScore < 50 ? 'black' : 'white'}
                          sx={{ zIndex: '10000' }}
                        >
                          {showValidationResult.ValidationResultScore} %
                        </Typography>
                      </LinearProgress>
                    </Stack>
                    <Stack flexDirection={'row'} justifyContent={''}>
                      <Typography sx={{ fontWeight: '700' }}> Analysis:</Typography>
                      <Chip startDecorator={showValidationResult.ValidationResultScore < 50 ? <ThumbDownSharp fontSize='12px' /> : <ThumbUpSharp fontSize='12px' />} color={showValidationResult.ValidationResultScore < 50 ? 'danger' : 'success'} variant='soft' size='md'>
                        {showValidationResult.ValidationResultScore >= 50 ? 'Validated' : 'Rejected'}
                      </Chip>
                    </Stack>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Stack flexDirection={'row'} justifyContent={'space-between'}>
                        <Typography sx={{ fontWeight: '700' }}> Skills: </Typography>
                        <Stack width={'100%'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'space-evenly'}>
                          {
                            showValidationResult.top_skills_matching.map((skill) => (
                              <Chip variant='outlined' key={skill} label={skill} color='primary' sx={{ backgroundColor: '#71C5E8', color: 'white', margin: '3px' }}>{skill}</Chip>
                            ))
                          }
                        </Stack>
                      </Stack>

                    </Box>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Stack flexDirection={'row'} justifyContent={'space-between'}>
                        <Typography sx={{ fontWeight: '700' }}> Analysis:</Typography>
                        <Typography variant='subtitle2' fontSize={'15px'} color={'black'}>{showValidationResult.Explanation}</Typography>
                      </Stack>
                    </Box>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Stack flexDirection={'row'} justifyContent={'space-between'}>
                        <Typography sx={{ fontWeight: '700' }}> Experience: </Typography>
                        <Typography variant='subtitle2' fontSize={'15px'} color={'black'}>{filteredCandidates.TotalExperience}</Typography>
                      </Stack>
                    </Box>
                  </Card>
                )
            }
          </Card>
          <Card variant='plain'></Card>
          <Card sx={{ display: 'flex', width: '30%', height: '100%' }} variant='soft' color='neutral'>
            <Card sx={{ display: 'flex', width: '93%', height: '50%', fontFamily: 'sans-serif' }}>
              <Stack flexDirection={'Column'} alignItems={'center'} justifyContent={'spac-around'}>
                <PersonIcon sx={{ fontSize: 100, padding: 0 }} color='action' />
                <table style={profileStyle}>
                  <tr>
                    <th>Email :</th>
                    <td><Typography>{filteredCandidates.Email}</Typography></td>
                  </tr>
                  <tr>
                    <th>Experience :</th>
                    <td><Typography>{filteredCandidates.TotalExperience}</Typography></td>
                  </tr>
                  <tr>
                    <th>Location :</th>
                    <td><Typography>{filteredCandidates.CurrentLocation}</Typography></td>
                  </tr>
                  <tr>
                    <th>Phone :</th>
                    <td><Typography>{filteredCandidates.PhoneNO}</Typography></td>
                  </tr>
                </table>
              </Stack>
            </Card>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Stack justifyContent={'center'} alignItems={'center'}>
                  <div style={{ alignSelf: 'center' }}>
                    <FormControlLabel
                      control={
                        <Card variant='soft' color='primary'>
                          <Checkbox checked={selectedModel === 'OpenAI'} onChange={handleModelSelection} value="OpenAI"
                            icon={<OpenAIIconUnchecked />}
                            checkedIcon={<OpenAIIconChecked />} />
                          <Typography>OpenAI</Typography>
                        </Card>}
                    />
                    <FormControlLabel
                      control={
                        <Card variant='soft' color='primary'>
                          <Checkbox checked={selectedModel === 'LLMA-2'} onChange={handleModelSelection} value="LLMA-2"
                            icon={<MetaIconUnchecked />}
                            checkedIcon={<MetaIconChecked />} />
                          <Typography>LLAMA2</Typography>
                        </Card>}
                    />
                  </div>
                </Stack>
              </CardContent>
              <Divider light />
              <CardActions sx={{ alignSelf: 'center' }}>
                <ButtonGroup variant='soft' color='neutral' >
                  <Button variant='solid' color='success' onClick={() => handleValidation()} sx={{ backgroundColor: '#C5E86C', color: 'white' }} startDecorator={<DomainVerificationIcon />}>Validate</Button>
                </ButtonGroup>
              </CardActions>
            </Box>
          </Card>
        </Stack>
        <Snackbar open={status.success || status.error} onClose={closeNotification} endDecorator={<IconButton onClick={closeNotification} ><CloseIcon /></IconButton>} color={status.success && !status.error ? 'success' : 'danger'} variant='soft' startDecorator={status.success && !status.error ? <CheckCircleIcon /> : <ErrorIcon />}>{status.message}</Snackbar>
        <Snackbar open={error.error} onClose={handleClose} endDecorator={<IconButton onClick={handleClose}><CloseIcon /></IconButton>} color='danger' variant='soft' startDecorator={<ErrorIcon />}>{error.detail.message}</Snackbar>
      </Stack>
    </div>
  );
};

export default Resume;