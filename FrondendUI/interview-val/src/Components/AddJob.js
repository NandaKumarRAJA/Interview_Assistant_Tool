import React, { useState,useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, Paper } from '@mui/material';
import Job from '../assets/images/job.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddJobForm = () => {
  const [jobDetails, setJobDetails] = useState({
    jobId: '',
    jobTitle: '',
    Description: '',
    Qualification: '',
    Responsibilities: '',
    Scope: '',
    YouBringIn: '',
  });


  const [existingJobs, setExistingJobs] = useState([]);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    // Fetch job details
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/Job_Details');
        setExistingJobs(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
        // Handle error, if needed
      }
    };

    // Call the fetchJobDetails function
    fetchJobDetails();
  }, []); 
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/job_description/', jobDetails,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Response:', response.data);

      // Show toast notification
      toast.success('New job added successfully!', { position: 'top-right', autoClose: 3000 });

      // Clear the form
      setJobDetails({
        jobId: '',
        jobTitle: '',
        Description: '',
        Qualification: '',
        Responsibilities: '',
        Scope: '',
        YouBringIn: '',
      });

    } catch (error) {
      console.error('Error:', error);
      // Handle error, if needed
    }
  };

  const underlineStyle = {
    borderBottom: '2px solid #000',
    display: 'inline',
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" mt={4}>
        <Typography variant="h5" style={underlineStyle} fontWeight="light">
          Job Details
          <img src={Job} alt="Job Icon" style={{ width: '40px', height: '40px', marginLeft: 15 }} />
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
          <Box
      component={Paper}
      elevation={3}
      style={{
        width: '25%',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
      }}
    >
      <Typography variant="h6" mb={2}>
        Existing Jobs
      </Typography>
      <Typography mb={2} style={{ fontWeight: 'bold' }}>
        <span style={{ marginRight: '20px' }}>Job ID</span>Job Title
      </Typography>
      {existingJobs.map((job) => (
        <Typography key={job.jobId} variant="body1" style={{ marginBottom: '8px' }}>
          <span style={{ marginRight: '20px' }}>{job.jobId}</span>
          {job.jobTitle}
        </Typography>
      ))}
    </Box>
        <Box
          component={Paper}
          elevation={3}
          style={{
            width: '65%',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="jobId"
              name="jobId"
              label="Job ID"
              style={{ width: '100%', marginBottom: '16px' }}
              onChange={(e) => setJobDetails({ ...jobDetails, jobId: e.target.value })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="jobTitle"
              name="jobTitle"
              label="Job Title"
              style={{ width: '100%', marginBottom: '16px' }}
              onChange={(e) => setJobDetails({ ...jobDetails, jobTitle: e.target.value })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="jobDescription"
              name="jobDescription"
              label="Job Description"
              style={{ width: '100%', marginBottom: '16px' }}
              onChange={(e) => setJobDetails({ ...jobDetails, Description: e.target.value })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              id="scope"
              name="scope"
              label="Scope"
              style={{ width: '100%', marginBottom: '16px' }}
              onChange={(e) => setJobDetails({ ...jobDetails, Scope: e.target.value })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="responsibilities"
              name="responsibilities"
              label="Responsibilities"
              style={{ width: '100%', marginBottom: '16px' }}
              onChange={(e) => setJobDetails({ ...jobDetails, Responsibilities: e.target.value })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="YouBringIn"
              name="YouBringIn"
              label="YouBringIn "
              style={{ width: '100%', marginBottom: '16px' }}
              onChange={(e) => setJobDetails({ ...jobDetails, YouBringIn: e.target.value })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="qualification"
              name="qualification"
              label="Qualification"
              style={{ width: '100%', marginBottom: '16px' }}
              onChange={(e) => setJobDetails({ ...jobDetails, Qualification: e.target.value })}
            />
            <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px', width: '100%' }}>
              Add Job
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default AddJobForm;
