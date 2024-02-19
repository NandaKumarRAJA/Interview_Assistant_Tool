import { createContext, useState, useEffect } from 'react';

const ResumeContext = createContext({});

export const Resumeprovider = ({ children }) => {
  const [resumePath, setResumePath] = useState('');
  const [selectedResume, setSelectedResume] = useState({})
  const [clusteredResumes, setClusteredResumes] = useState([])

  const addResumePath = (path) => {
    setResumePath(path)
  }

  const addClusteredResumes = (resumes) => {
    setClusteredResumes(resumes)
  }

  const addSelectedResume = (resume) => {
    setSelectedResume(resume)
  }

  return (
    <ResumeContext.Provider value={{ clusteredResumes, addClusteredResumes, selectedResume, addSelectedResume }}>
      {children}
    </ResumeContext.Provider>
  );
};

export default ResumeContext;