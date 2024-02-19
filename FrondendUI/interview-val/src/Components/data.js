
import React  ,{useState,useEffect}from 'react';
import { Card, Chip, Button, Alert } from '@mui/joy';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import LinearProgress from '@mui/joy/LinearProgress';
import Stack from '@mui/joy/Stack';
import { useCountUp } from 'use-count-up';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import { Box } from '@mui/material';
import { Grid } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import CircularProgress from '@mui/joy/CircularProgress';
import ReviewsIcon from '@mui/icons-material/Reviews';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
 
 
 
 
const DownloadData = ({ finalVerdict }) => {
    const {
        interviewer,
        FirstName,
        Performance_score,
        interview_verdict,
        interview_report,
        interview_topics,
        interview_question
    } = finalVerdict;
    console.log( finalVerdict)
    const final_score = (Performance_score / 5) * 100
 
    const handlePDF = async () => {
        const pdfContainer = document.getElementById('pdfContainer');
 
        if (pdfContainer) {
            try {
                const canvas = await html2canvas(pdfContainer);
 
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4',
                });
 
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
 
                pdf.save('interview_report.pdf');
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        }
    };
 
 
    return (
        <div style={{ textAlign: 'center', marginTop:'2%' }} id='pdfContainer'>
            <Alert variant='soft' color='primary' sx={{width:'20%', marginLeft:'40%'}}><Typography width={'100%'} level='h2' textAlign={'center'}>Interview Report</Typography></Alert>
            <Chip
                label="Interviewer Name"
                sx={{
                    width: '1000px',
                    height: '50px',
                    position: 'absolute',
                    top: 100,
                    left: 15,
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    bgcolor: '#B1C381'
                }}
            >
                <Typography variant="h5" width={'300px'} sx={{ color: 'white' }} >
                    <WorkIcon style={{ marginRight: '10px', marginTop: '2px', marginBottom: '-2%' }} />
 
                    Interviewer Name:
 
                    {interviewer}
                </Typography>
            </Chip>
            <Button variant="outlined" startDecorator={<DownloadForOfflineIcon/>} color="success" sx={{position:'relative', marginLeft:'80%',top :'-100px'}} onClick={handlePDF}>
                Download as PDF
            </Button>
            <></>
            <Chip
                label="Candidate Name"
                sx={{
                    width: '300px',
                    height: '50px',
                    position: 'absolute',
                    top: 100,
                    right: 15,
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    bgcolor: '#B1C381',
                }}
            >
                <Grid container alignItems="center">
 
                    <Grid item>
                        <Typography variant="h4" gutterBottom width={'250px'} marginBottom={'100px'} sx={{ color: '#200E3A', color:'white' }} >
                            Candidate Name : {FirstName}
                        </Typography>
                        <SwitchAccountIcon style={{ marginRight: '200px', marginBottom: '20px' }} />
 
 
                        <Typography style={{ color: 'black' }} fontWeight="bold">
 
                        </Typography>
                    </Grid>
                </Grid>
            </Chip>
 
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <CircularProgress sx={{ '--CircularProgress-size': '120px', top: 40 }} size='lg' determinate value={final_score}
                    color={interview_verdict == 'accept' ? 'success' : (interview_verdict == 'reject' ? 'danger' : 'warning')} >
                    {
                        (final_score).toFixed(2) + '%'
                    }
                </CircularProgress>
            </Box>
            <Grid container alignItems="center" marginLeft={'15%'} height="100vh">
                <Grid item md={4}>
                    <Card variant="soft" sx={{ width: '250%', right: 100, bottom: 150 }}>
                        <CardContent>
                            <Typography variant="h5" color="textPrimary" fontWeight="bold" gutterBottom>
                                Interview Verdict: <span style={{ color: 'grey' }}>{interview_verdict == 'accept' ? 'Accepted' : (interview_verdict == 'reject' ? 'Rejected' : 'Can consider')}</span>
                            </Typography>
                            <Typography variant="body1" color="textPrimary" fontWeight="bold" paragraph>
                                Overall Report:
                            </Typography>
                            <Typography variant="body1" color="textSecondary" paragraph>
                            {interview_report}                            </Typography>
                        </CardContent>
                    </Card> 
                </Grid>
            </Grid>
 
            <Grid container justifyContent={'center'} alignSelf={'center'} sx={{ width: '100%', marginTop: '-320px' }}>
            {interview_topics && interview_topics.map((topic, index) => (
                    <Grid item md={3}>
 
                        <Card size="sm" key={index} variant='soft' color='primary' sx={{ height: '90%', width: '90%', bottom: 10 }}>
                            <CardContent>
                                <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }} key={topic.topic_name}>
                                    <Typography variant="h6" fontWeight={'700'} color='warning' gutterBottom>
                                        {topic.topic_name}
                                    </Typography>
                                    <Chip variant="soft" startDecorator={<ReviewsIcon />}>
                                        <Typography variant="body1" color="textPrimary" paragraph>
                                            Topic Score: {topic.topic_score}
                                        </Typography>
                                    </Chip>
                                    <Typography variant="body2" color="textSecondary" paragraph>
                                        {topic.candidate_skill_rating_explanation}
                                    </Typography>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
 
                ))}
            </Grid>
 
            <Card variant="soft" color='primary' sx={{ width: '900px', margin: '0 auto' }}>
                <Card variant='plain' color='neutral' sx={{ width: '850px', height: '50%' }}>
                {interview_question && interview_question.map((qa, index) => (
                        <Box
                            key={index}
                            border='1px solid #ccc'
                            padding='10px'
                            marginBottom='10px'
                            height={150}
                        >
                            <Typography variant="h6" color="warning" fontWeight={'700'} gutterBottom>
                                Topic: {qa.Topic}
                            </Typography>
                            <Typography variant="body1" color="textPrimary" fontWeight={'700'} paragraph>
                                Question: {qa.question}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" fontWeight={'400'} paragraph>
                                Answer: {qa.answer}
                            </Typography>
                            <Chip variant="soft" startDecorator={<ReviewsIcon />}>
                                <Typography variant="body1" color="error" fontWeight={'700'}>
                                    Score: {qa.score}
                                </Typography>
                            </Chip>
                        </Box>
                    ))}
                </Card>
            </Card>
        </div>
    );
};
 
export default DownloadData;