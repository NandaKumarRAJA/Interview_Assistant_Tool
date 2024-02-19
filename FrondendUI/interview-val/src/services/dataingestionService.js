import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const postResumeExtract = async (folderPath) => {
  try {
    const response = await axios.post(`${API_URL}/resume_ingestion/?batch_id=${folderPath.batchId}`, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}


export { postResumeExtract};
