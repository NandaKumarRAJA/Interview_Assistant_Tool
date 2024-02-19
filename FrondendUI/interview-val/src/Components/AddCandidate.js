import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/joy/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import addcandidate from '../assets/images/add.png';
import { Card, Button, CardContent, CardActions, Input, Avatar, Stack, IconButton } from '@mui/joy';
import { Alert } from '@mui/joy';
import ErrorIcon from '@mui/icons-material/Error';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import DriveFolderUploadRoundedIcon from '@mui/icons-material/DriveFolderUploadRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepIndicator from '@mui/joy/StepIndicator';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UploadIcon from '@mui/icons-material/Upload';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import VerifiedIcon from '@mui/icons-material/Verified';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import TaskIcon from '@mui/icons-material/Task';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import UpdateIcon from '@mui/icons-material/Update';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import PDFLogo from '../assets/images/pdf-file.png'
import DOCXLogo from '../assets/images/docx.png'
import 'C:/Users/NandaKumarRaja/source/Interview-Assistant-Project/Interview-validation-Assistant/FrondendUI/interview-val/src/style/addCandidate.css'
import ClearIcon from '@mui/icons-material/Clear';
import { postResumeService, getClusteredResumes, postResumeFolderService } from '../services/resumeService';
import { postResumeExtract } from '../services/dataingestionService';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import HelpIcon from '@mui/icons-material/Help';
import ClusteredResumes from './clusteredResumes';
import ClusteredResumeView from './clusteredResumeView';
import useResume from './context/resumeContext';
function AddCandidate() {
  const [isUploaded, setIsUploaded] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [extractionResponse, setExtractionResponse] = useState({ status: 0, message: 'Begin resume extraction' })
  const [isUpdated, setIsUpdated] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
  const [uploadedFileList, setUploadedFileList] = useState([])
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [batchId, setBatchId] = useState('')
  const { clusteredResumes, addClusteredResumes, selectedResume } = useResume()




  const handleFolderUpload = async (event) => {
    try {
      const fileList = event.target.files;
      const filesArray = Array.from(fileList)
      // console.log(filesArray)
      setUploadedFileList(filesArray);
      setIsUploaded(true);
      const response = await postResumeFolderService(filesArray);
      setBatchId(response.batchId);
      // console.log(await getResumeById(response.resumeId))
    } catch (error) {
      console.error('Error uploading resumes:', error);
    }
  };

  const handleFileUpload = async (event) => {
    try {
      const fileList = event.target.files;
      const filesArray = Array.from(fileList);
      setUploadedFileList(filesArray);
      setIsUploaded(true);
      const response = await postResumeService(filesArray);
      setBatchId(response.batchId);
      // console.log(await getResumeById(response.resumeId))
    } catch (error) {
      console.error('Error uploading resumes:', error);
    }
  };

  const handleExtraction = async () => {
    try {
      setIsUploaded(true);
      const response = await postResumeExtract({ batchId: {batchId} });
      // setBatchId(response.batchId);
      console.log(response);
      setExtractionResponse({ status: (response[0].status ? 1 : 2), message: (response[0].status ? 'Resume extraction completed' : 'Resume extraction Failed') })
      handleGetClusteredResumes()
    } catch (error) {
      console.error('Error uploading resumes:', error);
    }
  };


  const handleGetClusteredResumes = async () => {
    try {
      const response = await getClusteredResumes()
      addClusteredResumes(response)
    }
    catch (error) {
      console.log('error occured ', error)
    }
  }


  return (
    <div>
      <Box className='page-header'>
        <Typography variant="h5" className='underline-style' fontWeight="light">
          Add Candidates
          <img src={addcandidate} alt="Add Candidate Icon" className='header-image' />
        </Typography>
      </Box>

      <Stepper size="lg" className='resume-stepper'>
        <Step
          orientation="vertical"
          indicator={
            <StepIndicator variant="soft" color='primary'>
              {isUploaded ? <CheckCircleIcon color='success' /> : <UploadIcon color='primary' />}
            </StepIndicator>
          }>
          <Typography className='resume-stepper-text'>
            {isUploaded ? 'Uploaded' : 'Upload'}
          </Typography>
        </Step>
        <Step
          orientation="vertical"
          indicator={
            <StepIndicator variant="soft" color='primary'>
              {extractionResponse.status === 1 ? <TaskIcon color='success' /> : (extractionResponse.status === 2 ? <ErrorIcon color='error' /> : <DocumentScannerIcon color='primary' />)}
            </StepIndicator>
          }>
          <Typography className='resume-stepper-text'>
            {extractionResponse.status === 1 ? 'Extracted' : 'Extract'}
          </Typography>
        </Step>
        <Step
          orientation="vertical"
          indicator={
            <StepIndicator variant="soft" color='primary'>
              {isUpdated ? <DoneAllIcon color='success' /> : <UpdateIcon color='primary' />}
            </StepIndicator>
          }>
          <Typography className='resume-stepper-text'>
            {isUpdated ? 'Updated' : 'Update'}
          </Typography>
        </Step>
        <Step
          orientation="vertical"
          indicator={
            <StepIndicator variant="soft" color='primary'>
              {isCreated ? <HowToRegIcon color='success' /> : <PersonAddAlt1Icon color='primary' />}
            </StepIndicator>
          }>
          <Typography className='resume-stepper-text'>
            {isCreated ? 'Created' : 'create'}
          </Typography>
        </Step>
      </Stepper>
      <Grid container spacing={5} gap={4} marginLeft={'2%'} height={'500px'} marginTop={'1.5%'} width={'98%'} >
        <Grid item xs={7.5} >
          <Card className='resume-container' variant='soft' color='neutral'>
            {
              !isUploaded ?
                <Alert variant='soft' color='warning' className='alert' startDecorator={<ErrorIcon color='error' />}>
                  No file preview, upload resume
                </Alert>
                :
                (
                  extractionResponse.status === 1 && Object.keys(selectedResume).length > 0 ?
                    <ClusteredResumeView/> :
                    <Alert variant='soft' color={extractionResponse.status === 1 ? 'success' : 'warning'} className='alert'>
                      {extractionResponse.message}
                    </Alert>
                )
            }
          </Card>
        </Grid>
        <Grid item xs={3.5}>
          <Card className='upload-container' variant='soft'>
            <div style={{ overflow: 'auto' }}>
              {
                extractionResponse.status === 1 ?
                  <ClusteredResumes />
                  :
                  (
                    uploadedFileList.length > 0 ?
                      <div>
                        {uploadedFileList.map((file) => (
                          <Card key={file.name} className='resume-list' variant='plain'>
                            <Grid container gap={.5}>
                              <Grid item md={3}>
                                <Avatar src={file.type === "application/pdf" ? PDFLogo : DOCXLogo} />
                              </Grid>
                              <Grid item md={8}>
                                <Stack flexDirection={'column'} width={'100%'}>
                                  <Typography level='title-md' fontSize={'14px'}>{file.name}</Typography>
                                  <Typography level='body-md' fontSize={'12px'} >{Math.round(file.size / 1024, 2)} kb</Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                          </Card>
                        ))}
                      </div>
                      :
                      <Alert variant='soft' color='warning' className='upload-alert' startDecorator={<FolderOffIcon color='danger' />}>
                        No files found
                      </Alert>
                  )
              }
            </div>
            <CardActions >
              {
                isUploaded ?
                  (
                    isVerified ?
                      <></>
                      :
                      <div>
                        <Button variant='soft' component="label" color='success' endDecorator={<KeyboardDoubleArrowRightIcon />} onClick={handleExtraction}>
                          Proceed
                        </Button>
                      </div>
                  )
                  :
                  <div className='resume-upload-button'>
                    <Button variant='soft' component="label" color='primary' className='upload-button' startDecorator={<DriveFolderUploadRoundedIcon />}>
                      Folder
                      <input type="file" style={{ display: 'none' }} onChange={handleFolderUpload} webkitdirectory="true" directory="true" multiple />
                    </Button>
                    <Button variant="soft" component="label" className='upload-button' startDecorator={<UploadFileRoundedIcon />}>
                      File
                      <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} accept=".pdf, .docx" multiple />
                    </Button>
                  </div>
              }
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div >
  )
}
export default AddCandidate;