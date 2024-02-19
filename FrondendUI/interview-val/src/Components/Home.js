import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Modal, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import home from '../assets/images/home.png';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { Chip } from '@mui/joy';
import AccountCircleIcon  from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';
import CircleIcon from '@mui/icons-material/Circle';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
}));

const underlineStyle = {
  textDecoration: 'underline',
  fontWeight: 'light',
};

const Home = () => {
  const [candidates, setCandidates] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/InterviewVerdict/AllCandidates/');
      const data = response.data;
      setCandidates(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };
 
  fetchData();
}, []);

  return (
    <div>
      <div className="container mt-4">
        <Box display="flex" alignItems="center" justifyContent="space-between" marginTop={1} marginBottom={1}marginLeft={3}>
          <Typography variant="h5" style={underlineStyle} fontWeight="light">
            Interview Pipeline 
            <img src={home} alt="Candidate Icon" style={{ width: '40px', height: '40px', marginLeft: 15 }} />
          </Typography>
        </Box>
        <TableContainer component={Paper} style={{ height: '500px' }} >
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Candidate Name</StyledTableCell>
                <StyledTableCell>Candidate ID</StyledTableCell>
                <StyledTableCell>Resume Validation</StyledTableCell>
                <StyledTableCell>QA Generation Status</StyledTableCell>
                <StyledTableCell>Interview Status</StyledTableCell>
                <StyledTableCell>Overall Verdict</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.candidate_id} >
                  <StyledTableCell>
                  </StyledTableCell>
                  <StyledTableCell ><Chip variant='soft' color='primary' startDecorator={<AccountCircleIcon color='disabled'/>}>{candidate.first_name}</Chip></StyledTableCell>
                  <StyledTableCell>{candidate.candidate_id}</StyledTableCell>
                  <StyledTableCell>
                    <span style={{ color: candidate.Resume_validation_status ? 'green' : 'red' }}>
                    {candidate.Resume_validation_status === 'Rejected' ?  <CancelIcon color='error'/> : (candidate.Resume_validation_status === 'Selected' ? <CheckCircleIcon color='success'/> : (candidate.Resume_validation_status == 'Not Available' ? <CircleIcon color='primary'/> : <CheckCircleIcon color='success'/>))}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell>
                    <span style={{ color: candidate.QandA_generation ? 'green' : 'red' }}>
                      {candidate.Resume_validation_status === 'Rejected' ?  <CancelIcon color='error'/> : candidate.QandA_generation === 'Not Available' ? <CircleIcon color='primary'/>: <CheckCircleIcon color='success'/> }
                    </span>
                  </StyledTableCell>
                  <StyledTableCell>
                    <span style={{ color: candidate.Interview_generation_status ? 'green' : 'red' }}>
                      {candidate.Interview_generation_status === 'Not Available' ? <CircleIcon color='primary'/> : <CheckCircleIcon color='success'/>}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell>
                    <span style={{ color: candidate.Interview_Verdict === 'Not Selected' ?  'red':'green' }}>
                      {candidate.Interview_Verdict === 'rejected' ?  <CancelIcon color='error'/> : (candidate.Interview_Verdict === 'accept' ? <CheckCircleIcon color='success'/> : (candidate.Interview_Verdict == 'can consider' ? <ErrorIcon color='warning'/> : <CircleIcon color='primary'/>))}
                    </span>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Home;