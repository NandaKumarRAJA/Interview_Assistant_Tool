import React, { useState, useEffect, useContext } from 'react';
 import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Link } from 'react-router-dom';
import axios from 'axios';
 
import { Collapse } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useMyContext } from './MyProvider';
import { Stack, Typography, Grid, Box, Divider } from '@mui/material'
import { Button, Card, Input, CardActions, ButtonGroup, Alert } from '@mui/joy';
import QAGenerationIcon from '../assets/images/qagenerationIcon.svg'
import PersonIcon from '@mui/icons-material/Person';
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import { Tabs } from '@mui/joy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import { Snackbar } from '@mui/joy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { IconButton } from '@mui/joy';
import Carousel from 'react-material-ui-carousel'
 
const QAGeneration = () => {
  const { updateContextData } = useMyContext();
 
  const [QandA, setQandA] = useState([]);
  const [isAnswerCollapsed, setAnswerCollapsed] = useState(true);
  const [skills, setskills] = useState([]);
  const [isLoading, setLoading] = useState(false);
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
  const [status, setStatus] = useState({ success: false, error: false, message: '' })
 
  const profileStyle = {
    padding: '4px',
    textAlign: 'left',
    textWrap: 'wrap'
  }
 
  const handleSearchChange = (event) => {
    setSearchCandidate(event.target.value);
 
  };
 
  const showFilteredCandidates = filteredCandidates.length > 0 && filteredCandidates[0].name !== '';
  const handleSearchClick = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/candidates/${searchCandidate}`);
      setFilteredCandidates(response.data);
      const skillresponse = await axios.get(`http://127.0.0.1:8000/Get_resume_validation_result?Candidate_id=${searchCandidate}`);
      setskills(skillresponse.data.top_skills_matching);
      updateContextData({ candidateInfo: response.data });
      setStatus({ success: true, error: false, message: 'Profile fetched successfully' })
    } catch (error) {
      setStatus({ success: false, error: true, message: 'Error fetching profile or Resume not validated' })
 
    }
  };
  const generate_Question = async () => {
    try {
      console.log(filteredCandidates.JobId)
      setLoading(true);
      const response = await axios.post(
        `http://127.0.0.1:8000/Generate_Q&A?candidateID=${searchCandidate}&job_id=${filteredCandidates.JobId}`,
        skills,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }
      );
      const responseData = response.data['Q&A'];

      if (responseData && responseData.question_answers) {
        const processedData = responseData.question_answers.map((qa) => ({
          domain: qa.domain,
          question: qa.question,
          answer: qa.answer,
        }));
      setQandA(processedData);
      setStatus({ success: true, error: false, message: 'Question and Answers generated successfully' })
      // downloadPDF(processedData);
    } else {
      console.error('Invalid data format:', responseData);
    }
    } catch (error) {
      setStatus({ success: false, error: true, message: 'Question and Answer generation failed' })
    } finally {
      setLoading(false);
    }
  };
 
 
  const handleTabsPDFDownload = () => {
    const contentPromises = [];
    const tabContainers = document.querySelectorAll('.MuiTabs-root .carousel-root');
 
    tabContainers.forEach((tabContainer) => {
      // contentPromises.push(html2pdf(tabContainer, getPDFConfig()));
    });
 
    Promise.all(contentPromises)
      .then((pdfs) => {
        const mergedPDF = pdfs.reduce((acc, pdf) => acc + pdf, '');
        const blob = new Blob([mergedPDF], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'QandA_Generation_Merged.pdf';
        link.click();
      })
      .catch((error) => console.error('Error merging PDFs:', error));
  };
 
  const getPDFConfig = () => {
    return {
      margin: 10,
      filename: 'QandA_Generation.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
  };
 
  const uniqueDomains = [...new Set(QandA.map(qa => qa.domain))];
  const [selectedDomain, setSelectedDomain] = useState(uniqueDomains.length > 0 ? uniqueDomains[0] : '');
  const underlineStyle = {
    borderBottom: '2px solid #000',
    display: 'inline',
  };
  const handleChangeTab = (event, newValue) => {
    setSelectedDomain(newValue);
  };
  const closeNotification = () => {
    setStatus({ status: false, error: false, message: '' })
  }


  // const downloadPDF = (data) => {
  //   const content = generatePDFContent(data);
  //   const pdfExporter = html2pdf();

  //   // Use the instance to export the content
  //   pdfExporter.from(content)
  //     .set({
  //       margin: 10,
  //       filename: 'QandA_Generation.pdf',
  //       image: { type: 'jpeg', quality: 0.98 },
  //       html2canvas: { scale: 2 },
  //       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  //     })
  //     .outputPdf();
  // };
  
  // const generatePDFContent = (data) => {
    
  //   // Customize the content structure based on your data
  //   return (
  //     <div>
  //       {data.map((item, index) => (
  //         <div key={index}>
  //           <h1>Questions and Answers</h1>
  //           <h2>{item.domain}</h2>
  //           <p>Question: {item.question}</p>
  //           <p>Answer: {item.answer}</p>
  //           <hr />
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };


 
  return (
    <div>
      <Stack flexDirection={'column'} sx={{ padding: '10px' }} spacing={10}>
        <Grid container>
          <Grid item xs={4}>
            <Stack flexDirection={'row'} alignItems={'center'} paddingLeft={'50px'}>
              <Typography variant="h5" style={underlineStyle} fontWeight="light">
                QA Generation
                <img src={QAGenerationIcon} width={40} height={40} style={{ paddingLeft: '15px', paddingBottom: 0 }} />
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
        <Stack flexDirection={'row'} width={'100%'} justifyContent={'space-evenly'}>
          <Card variant='soft' color='primary' sx={{ height: '450px', width: '60%', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
 
            <Tabs onChange={handleChangeTab} sx={{ width: '100%', height: '20%', borderRadius:'10px' }}>
              <Carousel sx={{ width: '90%', height: '90%', margin :'auto' }} autoPlay={false}>
                {uniqueDomains.reduce((acc, domain, index) => {
                  if (index % 4 === 0) {
                    acc.push(uniqueDomains.slice(index, index + 4));
                  }
                  return acc;
                }, []).map((chunk, chunkIndex) => (
                    <TabList key={chunkIndex} disableUnderline sx={{width : '90%', justifyContent : 'space-evenly', flex: 1, display:'flex', borderRadius: 'xl', margin:'auto' }}>
                      {chunk.map((domain, index) => (
                          <Tab disableIndicator key={index} value={domain} color='neutral' sx={{borderRadius:'10px'}}>{domain}</Tab>
                      ))}
                    </TabList>
                ))}
              </Carousel>
            </Tabs>
            {
              QandA.length !== 0 ?
                <Card variant='soft' sx={{ overflow: 'auto', width: '92%', marginTop: '5%', zIndex: 1, backgroundColor: 'rgba(54, 84, 134, .5)' }}>
                  {
                    QandA.length !== 0 ?
                      <Button startDecorator={<VisibilityIcon />} sx={{ backgroundColor: '#71C5E8', color: 'white', height: '25px', marginLeft: '70%', width: '25%' }} onClick={() => setAnswerCollapsed(!isAnswerCollapsed)}>
                        {isAnswerCollapsed ? 'Show Answer' : 'Hide Answer'}
                      </Button>
                      :
                      <></>
                  }
 
                  {uniqueDomains.map((domain, index) => (
                    <Box key={index} mb={2} display={selectedDomain === domain ? 'block' : 'none'} margin={'2%'}>
                      {QandA.filter(qa => qa.domain === domain).map((qa, index) => (
                        <Box key={index} mb={2}>
                          <Stack flexDirection={'row'} color={'white'}>
                            <LiveHelpIcon />
                            <Typography variant="body1" mb={1} sx={{ fontFamily: 'Arial, sans-serif', color: 'white', marginLeft: '4px' }}>
                              {qa.question}
                            </Typography>
                          </Stack>
                          <Collapse in={!isAnswerCollapsed}>
                            <Card color='success' variant='plain'>
                              <Stack flexDirection={'row'} color={'black'}>
                                <QuestionAnswerIcon />
                                <Typography color={'GrayText'} variant="body1" mb={1} sx={{ fontFamily: 'Arial, sans-serif', color: 'black', fontSize: '94%', marginLeft: '4px' }}>
                                  {qa.answer}
                                </Typography>
                              </Stack>
                            </Card>
                          </Collapse>
                        </Box>
                      ))}
                    </Box>
                  ))}
                </Card>
                :
                <></>
            }
 
 
            {isLoading && (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress color="primary" />
              </Box>
            )}
 
            {!isLoading && QandA.length === 0 && (
              <Alert variant='soft' color='warning' sx={{ width: '50%', textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} startDecorator={<ErrorIcon color='error' />}>
                Search Candidate to Generate Question
              </Alert>
            )}
          </Card>
          <Card sx={{ display: 'flex', width: '30%', height: '100%' }} variant='soft' color='neutral'>
            <Card sx={{ display: 'flex', width: '93%', height: '60%', fontFamily: 'sans-serif' }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Divider light />
              <CardActions sx={{ alignSelf: 'center' }}>
                <ButtonGroup variant='soft' color='neutral' >
                  <Button variant='solid' color='primary' onClick={generate_Question} sx={{ backgroundColor: '#71C5E8', color: 'white' }} startDecorator={<SettingsSuggestIcon />}>Generate Question</Button>
                  <Link to={{ pathname: '/ScheduleInterview', state: { updateContextData } }}>
                    <Button variant='solid' color='success' sx={{ backgroundColor: '#C5E86C', color: 'white' }} startDecorator={<EditCalendarIcon />}>Schedule Interview</Button>
                  </Link>
                 

                </ButtonGroup>
              </CardActions>
            </Box>
            <Button startDecorator={<CloudDownloadIcon />} sx={{ height: '20px', width: '100%' }} onClick={handleTabsPDFDownload}
            >
              Download
            </Button>
          </Card>
        </Stack>
      </Stack>
      <Snackbar open={status.success || status.error} onClose={closeNotification} endDecorator={<IconButton onClick={closeNotification} ><CloseIcon /></IconButton>} color={status.success && !status.error ? 'success' : 'danger'} variant='soft' startDecorator={status.success && !status.error ? <CheckCircleIcon /> : <ErrorIcon />}>{status.message}</Snackbar>
      
    </div>
  );
};
 
export default QAGeneration;