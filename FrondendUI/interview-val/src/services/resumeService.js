import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const postResumeService = async (resumes) => {
  try {
    const formData = new FormData();
    resumes.forEach((resume) => {
      formData.append('Resumes', resume);
    });
    const response = await axios.post(`${API_URL}/process_resume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

const postResumeFolderService = async (resumes) => {
  try {
    const formData = new FormData();
    resumes.forEach((resume) => {
      formData.append('Resumes', resume);
    });
    const response = await axios.post(`${API_URL}/process_resume_folder`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

const getResumeByBatchId = async (batchId) => {
  try {
    const response = await axios.get(`${API_URL}/get_resumes_by_batch/${batchId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

const getClusteredResumes = async () => {
  try {
    const response = await axios.get(`${API_URL}/clustered_resumes`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { postResumeService, postResumeFolderService, getClusteredResumes };
