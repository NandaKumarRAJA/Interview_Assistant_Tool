import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import candidate from '../assets/images/can.png';
import { Link } from 'react-router-dom';
import { experienceRanges, indianCities } from '../data/resumeData';
import { ButtonGroup, Card, Chip, Autocomplete, Button, IconButton } from '@mui/joy';
import {Stack} from '@mui/material';
import TextField from '@mui/material/TextField';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import TuneIcon from '@mui/icons-material/Tune';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import EmailIcon from '@mui/icons-material/Email';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import { Snackbar } from '@mui/joy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
 
 
 
 
function Candidate() {
    const [rows, setRows] = useState([]);
    const [copied, setCopied] = useState({ status: false, copiedText: '' });
 
    const [jobTitles, setJobDescription] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [error, setError] = useState({ error: false, detail: '' });
 
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/Job_Details')
            .then(response => {
                setJobDescription(response.data);
            })
            .catch(error => {
                console.error('Error fetching job titles:', error);
            });
    }, []);
 
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        console.log(text)
        setCopied({ status: true, copiedText: text });
    };
    const handleCopyClose = () => {
        setCopied({ status: false, copiedText: '' })
    }
 
    const role = sessionStorage.getItem('Role');
    const isAdmin = role && role === 'admin';
 
    useEffect(() => {
        const token = sessionStorage.getItem('token');
 
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/Details', {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
 
 
                if (response.data && response.data.length > 0) {
                    const rowsWithId = response.data.map((row, index) => ({ ...row, id: index + 1 }));
                    setRows(rowsWithId);
                } else {
                    throw new Error('Empty response or invalid data format');
                }
            } catch (error) {
                console.error('Error details:', error.message);
 
                if (axios.isAxiosError(error)) {
                    console.error('Response details:', error.response?.data);
                    console.error('HTTP status code:', error.response?.status);
                    console.error('Response headers:', error.response?.headers);
                } else {
                    console.error('Request details:', error.request);
                }
            }
        };
 
        fetchData();
    }, []);
 
    const HandleFilter = async () => {
        console.log(selectedJob, selectedCity, selectedExperience);
 
        try {
            let urlComponents = ['http://127.0.0.1:8000/filtered-candidates?'];
 
            let parameterAdded = false;
 
            if (selectedExperience) {
                urlComponents.push(`total_experience=${selectedExperience}`);
                parameterAdded = true;
            }
 
            if (selectedJob && selectedJob.jobId) {
                urlComponents.push(`${parameterAdded ? '&' : ''}job_id=${selectedJob.jobId}`);
                parameterAdded = true;
            }
 
            if (selectedCity) {
                urlComponents.push(`${parameterAdded ? '&' : ''}current_location=${selectedCity}`);
            }
            const url = urlComponents.join('');
 
            console.log(url);
            const response = await axios.get(url);
 
            if (response.data.candidates && Array.isArray(response.data.candidates) && response.data.candidates.length > 0) {
                const filteredRows = response.data.candidates;
                setRows(filteredRows);
                console.log(filteredRows);
            } else {
                console.error('Invalid or empty response format');
                setRows([]);
                setError({ error: true, detail: 'No candidate or job found' })
 
            }
        } catch (error) {
            console.error('Error fetching candidate data:', error);
        }
    };
 
    const Container = styled('div')({
        margin: '20px',
        display: 'flex',
        alignItems: 'center',
    });
    const underlineStyle = {
        borderBottom: '2px solid #000',
        display: 'inline'
    };
    const handleDelete = (candidateId) => {
        const apiUrl = 'http://127.0.0.1:8000';
 
        axios.delete(`${apiUrl}/DeleteCandidate/${candidateId}`)
            .then((response) => {
                console.log('Candidate deleted successfully', response.data);
 
                setRows((prevRows) => prevRows.filter((candidate) => candidate.CandidateID !== candidateId));
            })
            .catch((error) => {
                console.error('Error deleting candidate:', error);
            });
    };
    const profileStyle = {
        padding: '4px',
        textAlign: 'left',
    }
    return (
        <div >
            <Container >
                <Box display="flex" alignItems="center">
                    <Typography variant="h5" style={underlineStyle} fontWeight="light">
                        Candidates
                        <img src={candidate} alt="Candidate Icon" style={{ width: '40px', height: '40px', marginLeft: 15 }} />
                    </Typography>
                </Box>
                <Box marginLeft="auto">
                {isAdmin && (
        <Link to={'/Addcandidate'}>
          <Button
            variant='solid'
            color='primary'
            startIcon={<PersonAddAltIcon />}
            sx={{ backgroundColor: '#71C5E8', color: 'white' }}
          >
            Create Candidate
          </Button>
        </Link>
      )}
                </Box>
            </Container>
            <Card color='primary' variant='soft' sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Card variant='plain' sx={{ width: '98%' }}>
                    <Grid container width={'100%'}>
                        <Grid item md={8} alignItems={'center'} justifyContent={'space-evenly'}>
                            <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                <Autocomplete
                                    id="job-role-selection"
                                    placeholder="Job Title"
                                    options={jobTitles}
                                    getOptionLabel={(option) => option.jobTitle}
                                    value={selectedJob}
                                    onChange={(event, newValue) => {
                                        setSelectedJob(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Job Role"
                                            placeholder="Job Role"
                                            defaultValue="Data Scientist"
                                        />
                                    )}
                                    sx={{
                                        height: '45px',
                                        width: '30%',
                                    }}
                                    variant='soft'
                                    color='neutral'
                                    popupIcon={<KeyboardArrowDownIcon />}
                                />
                                <Autocomplete
                                    id="experience"
                                    placeholder="Experience"
                                    options={experienceRanges}
                                    getOptionLabel={(option) => option}
                                    value={selectedExperience}
                                    onChange={(event, newValue) => {
                                        setSelectedExperience(newValue);
                                    }}
                                    sx={{
                                        height: '45px',
                                        width: '30%',
                                    }}
                                    variant='soft'
                                    color='neutral'
                                    popupIcon={<KeyboardArrowDownIcon />}
                                />
                                <Autocomplete
                                    id="city"
                                    placeholder="City"
                                    options={indianCities}
                                    getOptionLabel={(option) => option}
                                    renderTags={(tags) => (
                                        <Chip variant="plain" sx={{ width: '100%' }}>{tags}</Chip>
                                    )}
                                    value={selectedCity}
                                    onChange={(event, newValue) => {
                                        setSelectedCity(newValue);
                                    }}
                                    sx={{
                                        height: '45px',
                                        width: '30%',
                                    }}
                                    variant='soft'
                                    color='neutral'
                                    popupIcon={<KeyboardArrowDownIcon />}
                                />
                            </Stack>
                        </Grid>
                        <Grid item md={3}>
                            <ButtonGroup variant='soft' sx={{ marginLeft: '40%', marginTop: '2%', width: '90%' }} color='neutral'>
                                <Button variant='solid' onClick={HandleFilter} color='success' sx={{ backgroundColor: '#C5E86C' }} startDecorator={<TuneIcon />}>Filter</Button>
                                <Link to="/JD">
                                    <Button variant='solid' color='primary' sx={{ backgroundColor: '#71C5E8' }} startDecorator={<WorkOutlineIcon />}>Job Vacancy</Button>
                                </Link>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </Card>
                <Card variant='plain'>
                    <Grid container spacing={1}>
                        {rows.map((candidate) => (
                            <Grid item md={4}>
                                <Card sx={{ height: '70%', width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} key={candidate.id}  >
                                    <PersonIcon color='action' sx={{ height: '20%', width: '20%' }} />
                                    <table style={profileStyle}>
                                        <tr>
                                            <th>ID :</th>
                                            <td><Chip sx={{ width: '50%' }}>{candidate.CandidateID}
                                                <IconButton onClick={() => handleCopy(candidate.CandidateID)} sx={{ height: '5%', width: '5%' }}><FileCopyIcon sx={{ height: '50%', width: '50%' }} /></IconButton>
                                            </Chip></td>
                                        </tr>
                                        <tr>
                                            <th>Email :</th>
                                            <td><Chip variant='plain' startDecorator={<EmailIcon />}>{candidate.Email}</Chip></td>
                                        </tr>
                                        <tr>
                                            <th>Experience:</th>
                                            <td><Typography>{candidate.TotalExperience}</Typography></td>
                                        </tr>
                                        <tr>
                                            <th>Location :</th>
                                            <td><Chip variant='plain' startDecorator={<LocationOnIcon />}>{candidate.Address}, {candidate.CurrentLocation}</Chip></td>
                                        </tr>
                                    </table>
                                    <Button startDecorator={<DeleteIcon />} variant='soft' color='danger' sx={{ width: '50%', margin: 'auto' }} size='sm' onClick={() => handleDelete(candidate.CandidateID)}>
                                        Delete
                                    </Button>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Card>
            </Card>
            <Snackbar open={copied.status} onClose={handleCopyClose} endDecorator={<IconButton onClick={handleCopyClose} ><CloseIcon /></IconButton>} color='success' variant='soft' startDecorator={<CheckCircleIcon />}>{copied.copiedText} is copied to clipboard</Snackbar>
            <Snackbar open={error.error} onClose={() => setError({ error: false, detail: '' })} endDecorator={<IconButton onClick={() => setError({ error: false, detail: '' })}><CloseIcon /></IconButton>} color='danger' variant='soft' startDecorator={<ErrorIcon />}>{error.detail}</Snackbar>
 
        </div >
    );
}
 
export default Candidate;