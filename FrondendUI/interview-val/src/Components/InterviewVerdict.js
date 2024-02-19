import React, { useState } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/joy/CircularProgress';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import Typography from '@mui/joy/Typography';
import { Box, Stack, IconButton } from '@mui/material';
import { ThumbDownAlt, ThumbUpAlt } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { styled } from '@mui/joy';
import { Grid, Divider } from '@mui/material'
import { Button, Card, Input, ButtonGroup, Chip, Alert } from '@mui/joy';
import InterviewVerdictIcon from '../assets/images/interviewVerdictIcon.svg'
import ErrorIcon from '@mui/icons-material/Error';
import Carousel from 'react-material-ui-carousel'
import { Rating } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import Dialog from '@mui/material/Dialog';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import DownloadData from './data';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';

const InterviewVerdict = () => {
  const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [status, setStatus] = useState({ success: false, error: false, message: '' })
  const [generatedOutput, setGeneratedOutput] = useState({
    CandidateID: '',
    FirstName: '',
    JobId: '',
    overall_score: '',
    interview_verdict: '',
    interview_report: '',
    topics: [],
    interviewer: '',
    interview_question: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [searchCandidate, setSearchCandidate] = useState('');
  // Calculate Score Percentage with optional chaining and try-catch
  let Score_percentage;
  try {
    Score_percentage = (((generatedOutput?.overall_score !== '' ? generatedOutput?.overall_score : 0) / 5) * 100);
  } catch (error) {
    // Handle the error (e.g., log it or set a default value)
    console.error('Error calculating Score Percentage:', error);
    Score_percentage = 0; // Set a default value
  } const [filteredCandidates, setFilteredCandidates] = useState({
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
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [final_verdict, setfinalverdict] = useState({})

  const handleSearchChange = (event) => {
    setSearchCandidate(event.target.value);
  };
  const handleSearchClick = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/candidates/${searchCandidate}`);
      setFilteredCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidate data:', error);
    } finally {
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('files', file);
    setTranscriptFile(formData);
    setUploadedFileName(file.name);
  };

  const handleGenerateOutput = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`http://127.0.0.1:8000/Generate_final_verdict/?CandidateId=${searchCandidate}&JobId=${filteredCandidates.JobId}`, transcriptFile, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'accept': 'application/json'
        }
      });
      setGeneratedOutput(response.data);

      if (response.data === null) {
        setGeneratedOutput({
          CandidateID: '',
          FirstName: '',
          JobId: '',
          overall_score: '',
          interview_verdict: '',
          interview_report: '',
          topics: [],
          interviewer: '',
          interview_question: []
        })
      }
      console.log(response.data)
      const final_verdict_result = {
        CandidateID: filteredCandidates.CandidateID ?? '',
        FirstName: filteredCandidates.FirstName ?? '',
        JobId: filteredCandidates.JobId ?? '',
        Performance_score: response.data.overall_score ?? '',
        interview_verdict: response.data.interview_verdict ?? '',
        interview_report: response.data.overall_report ?? '',
        interview_topics: response.data.topics ?? ' ',
        interview_question: response.data.questions_answer ?? '',
        interviewer: response.data.interviewer_name ?? ''
      };
      // console.log(final_verdict_result)
      setfinalverdict(final_verdict_result)
      const Result_posting = await axios.post(
        'http://127.0.0.1:8000/Interview_Verdict_report/',
        final_verdict_result,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const underlineStyle = {
    borderBottom: '2px solid #000',
    display: 'inline',
    marginBottom: '10px',
  };
  const profileStyle = {
    padding: '4px',
    textAlign: 'left',
    textWrap: 'wrap'
  }

  const closeNotification = () => {
    setStatus({ status: false, error: false, message: '' })
  }
  return (
    <div>
      <Stack flexDirection={'column'} sx={{ padding: '10px' }} spacing={10}>
        <Grid container>
          <Grid item xs={4}>
            <Stack flexDirection={'row'} alignItems={'center'} paddingLeft={'50px'}>
              <Typography level='h3' style={underlineStyle} fontWeight="light">
                Interview Verdict
                <img src={InterviewVerdictIcon} width={40} height={40} style={{ paddingLeft: '15px', paddingBottom: 0 }} />
              </Typography>
            </Stack>
          </Grid>
          <Grid xs={6}>
            <Input id='search-candidate' placeholder='Search Candidate' type='search' onChange={handleSearchChange}
              startDecorator={<PersonSearchIcon color='info' />}
              endDecorator={<Button variant='soft' sx={{ height: '40px' }} onClick={handleSearchClick}>Search</Button>}
              sx={{ width: '50%', height: '40px', alignSelf: 'center', position: 'relative', top: '10px' }} variant='soft' color='primary' />
          </Grid>
        </Grid>
        <Stack flexDirection={'row'} width={'100%'} justifyContent={'space-evenly'}>
          <Card variant='soft' color='primary' sx={{ height: '600', width: '60%', alignItems: 'center', justifyContent: 'center' }}>
            {
              generatedOutput.CandidateID !== '' && generatedOutput.CandidateID !== null && !isLoading ?
                <>
                  <Box width={'90%'}>
                    <Card variant='plain' sx={{ height: '93%' }}
                      color={Score_percentage >= 60 ? 'success' : 'danger'}>
                      <CardContent orientation='vertical'>
                        <Grid container spacing={3}>
                          <Grid item md={5} alignItems={'flex-start'}>
                            <CircularProgress sx={{ '--CircularProgress-size': '110px', position: 'relative', left: '20%' }} size='lg' determinate value={Score_percentage}
                              color={generatedOutput.interview_verdict == 'accept' ? 'success' : (generatedOutput.interview_verdict == 'reject' ? 'danger' : 'warning')} >
                              {
                                (Score_percentage).toFixed(2) + '%'
                              }
                            </CircularProgress>
                          </Grid>
                          <Grid item md={7}>
                            <Stack flexDirection={'column'} alignItems={'flex-start'} spacing={1}>
                              <Typography level='h2'>
                                {filteredCandidates.FirstName.toUpperCase()} {filteredCandidates.LastName.toUpperCase()}
                              </Typography>
                              <Chip variant='solid'
                                color={generatedOutput.interview_verdict == 'accept' ? 'success' : (generatedOutput.interview_verdict == 'reject' ? 'danger' : 'warning')}
                                size='lg'
                                startDecorator={generatedOutput.interview_verdict == 'accept' ? <ThumbUpAlt color='white' /> : (generatedOutput.interview_verdict == 'reject' ? <ThumbDownAlt color='white' /> : <ThumbsUpDownIcon color='white' />)}
                              >
                                {generatedOutput.interview_verdict == 'accept' ? 'Accepted' : (generatedOutput.interview_verdict == 'reject' ? 'Rejected' : 'Can Consider')}
                              </Chip>
                            </Stack>
                          </Grid>
                          <Grid item md={12}>
                            <Typography level='title-sm' textAlign={'left'}> {generatedOutput.overall_report}</Typography>
                          </Grid>
                          <Grid item md={12}>
                            <Carousel >
                              {
                                generatedOutput.topics.length !== 0 && generatedOutput.topics.map((topic) => (
                                  <Card key={topic.topic_name}>
                                    <Typography level='title-md'>{topic.topic_name}</Typography>
                                    <Stack flexDirection={'row'} width={'30%'} justifyContent={'space-between'}>
                                      <Typography>
                                        {topic.topic_score} / 5
                                      </Typography>
                                      <Rating
                                        value={topic.topic_score}
                                        precision={.1}
                                        icon={<CircleIcon />}
                                        sx={{ color: (topic.topic_score > 3 ? 'green' : (topic.topic_score === 3 ? '#FFBB64' : '#FF8F8F')) }}
                                        emptyIcon={<CircleIcon />} readOnly
                                      />
                                    </Stack>
                                    <Typography level='title-sm' overflow={'auto'} maxHeight={'60px'}>{topic.candidate_skill_rating_explaination}</Typography>
                                  </Card>
                                ))
                              }
                            </Carousel>
                          </Grid>
                          <Grid item md={12} alignContent={'center'} justifyContent={'center'}>
                            <Alert
                              color={
                                generatedOutput.interview_verdict === 'accept'
                                  ? 'success'
                                  : generatedOutput.interview_verdict === 'reject'
                                    ? 'danger'
                                    : 'warning'
                              }
                              size="md"
                              variant="soft"
                              sx={{ width: '70%', margin: 'auto', color: 'black' }}
                            >
                              {generatedOutput.interview_verdict === 'accept' ? (
                                'The candidate has sufficient skill set for the position.'
                              ) : generatedOutput.interview_verdict === 'reject' ? (
                                'The candidate does not meet the requirements for the position.'
                              ) : (
                                'The candidate partially meets the requirement '
                              )}
                            </Alert>

                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                </>
                :
                (isLoading ?
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress color="primary" />
                  </Box>
                  :
                  <Alert variant='soft' color='warning' sx={{ width: '50%', textAlign: 'center' }} startDecorator={<ErrorIcon color='error' />}>Search Candidate to see Final Verdict</Alert>
                )
            }
          </Card>
          <Card sx={{ display: 'flex', width: '30%', height: '100%' }} variant='soft' color='neutral'>
            <Card variant='soft' color='white' sx={{ display: 'flex', width: '93%', height: '60%', fontFamily: 'sans-serif' }}>
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
            {uploadedFileName && (
              <Chip>
                <Typography variant="body1" color="textSecondary" marginBottom={1}>
                  {uploadedFileName}
                </Typography>
              </Chip>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Divider light />
              <CardActions sx={{ alignSelf: 'center' }}>
                <ButtonGroup variant='soft' color='neutral' >
                  <Button onChange={handleFileUpload} component="label" tabIndex={-1} variant='solid' color='primary' sx={{ backgroundColor: '#71C5E8', color: 'white' }}
                    startDecorator={<FileUploadIcon />}>
                    Upload a file
                    <VisuallyHiddenInput type="file" />
                  </Button>
                  <Button variant='solid' color='success' onClick={handleGenerateOutput} sx={{ backgroundColor: '#C5E86C', color: 'white' }} startDecorator={<SettingsSuggestIcon />}>Generate Output</Button>
                </ButtonGroup>
              </CardActions>
            </Box>
            <Button startDecorator={<FullscreenIcon />} onClick={handleClickOpen}>View Detailed Verdict</Button>
            <Dialog fullScreen open={open} onClose={handleClose} >
              <IconButton
                edge="start"
                onClick={handleClose}
                aria-label="close" sx={{ width: '5%' }}>
                <CloseIcon />
              </IconButton>
              <DownloadData finalVerdict={final_verdict === '' ? { data: 'null passed' } : final_verdict} />
            </Dialog>
          </Card>
        </Stack>
      </Stack>
    </div>
  );
};


export default InterviewVerdict;