import React, { useState } from 'react'
import useResume from './context/resumeContext';
import ResumeIcon from '../assets/images/clusteredResumeIcon.png';
import { Grid, Card, Avatar, Button, Stack, Typography, Chip, Divider, CardActions, CardContent, CardOverflow } from '@mui/joy';
import 'C:/Users/NandaKumarRaja/source/Interview-Assistant-Project/Interview-validation-Assistant/FrondendUI/interview-val/src/style/addCandidate.css'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

const ClusteredResumes = () => {
    const { clusteredResumes, addSelectedResume } = useResume()
    const [selectedResumeMail, setSelectedResumeMail] = useState('')
    const handleResumeSelection = (resume) => {
        addSelectedResume(resume)
        setSelectedResumeMail(resume.personal_info.email)
    }
    return (
        <div>
            {clusteredResumes.map((resume) => (
                <div onClick={() => handleResumeSelection(resume)}>
                    <Card key={resume.personal_info.email} variant='soft' color={selectedResumeMail === resume.personal_info.email ? 'primary' : 'white'} className='clustered-resume-card'>
                        <CardContent sx={{ marginTop: '2%', marginBottom: '0%' }}>
                            <Grid container gap={3}>
                                <Grid item md={2}>
                                    <img src={ResumeIcon} style={{ height: '50px', width: '50px' }} />
                                </Grid>
                                <Grid item md={8}>
                                    <Stack flexDirection={'column'} width={'100%'} justifyContent={'space-evenly'} height={'50px'}>
                                        <Typography level='h4'>{resume.personal_info.name}</Typography>
                                        <Typography level='body-md' fontSize={'12px'} >{resume.personal_info.email}</Typography>
                                    </Stack>
                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>
                </div>
            ))}
            <Button onClick={() => setSelectedResumeMail('')} className='btn' size='small' variant='soft'sx={{ borderRadius: '20px', margin: 'auto', marginTop: '3%', width: '30%' }} startDecorator={<EditIcon />}>Edit</Button>

        </div>
    )
}

export default ClusteredResumes
