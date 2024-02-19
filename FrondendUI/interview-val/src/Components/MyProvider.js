import { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [contextData, setContextData] = useState({
    candidateInfo: {
        CandidateID: '',
        FirstName: '',
        PhoneNO: '',
        CurrentLocation: '',
        Email: '',
        DOB: '',
        DOJ: '',
        jobId: '',
        Address: '',
        TotalExperience: '',
        LastName: '',
        LinkinID: '',
        Resume: ''
      

    },
  });

  const updateContextData = (newData) => {
    setContextData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  return (
    <MyContext.Provider value={{ contextData, updateContextData }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};