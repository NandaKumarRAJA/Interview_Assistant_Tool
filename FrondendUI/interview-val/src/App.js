import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Home from './Components/Home';
import Candidate from './Components/Candidate';
import AddCandidate from './Components/AddCandidate';
import Signup from './Components/Signup';
import Jobvacancy from './Components/Jobvacancy';
import QAGeneration from './Components/QAGeneration';
import Resume from './Components/Resume';
import { MyProvider } from './Components/MyProvider';
import ScheduleInterview from './Components/ScheduleInterview';
import AddJob from './Components/AddJob';
import InterviewVerdict from './Components/InterviewVerdict';
import { Resumeprovider } from './Components/context/resumeProvider';
 
 
const ProtectedRoute = ({ element }) => {
  const isLoggedIn = sessionStorage.getItem('token');
 
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
 
  return element;
};
 
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('token'));
 
  const handleSignIn = () => {
    setIsLoggedIn(true);
  };
 
  const handleSignOut = () => {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
  };
 
  return (
    <Resumeprovider>
      <BrowserRouter>
        {isLoggedIn && <Navbar onSignOut={handleSignOut} />}
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/Home" /> : <Login onSignIn={handleSignIn} />}
          />
          <Route path="/Login" element={<Login />} />
          <Route
            path="/Home"
            element={<ProtectedRoute element={<Home />} />}
          />
          <Route
            path="/Candidate"
            element={<ProtectedRoute element={<Candidate />} />}
          />
          <Route
            path="/Addcandidate"
            element={<ProtectedRoute element={<AddCandidate />} />}
          />
 
          <Route
            path="/Resume"
            element={<ProtectedRoute element={<Resume />} />}
          />
          <Route
            path="/QAGeneration"
            element={<ProtectedRoute element={<QAGeneration />} />}
          />
          <Route
            path="/ScheduleInterview"
            element={<ProtectedRoute element={<ScheduleInterview />} />}
          />
          <Route
            path="/InterviewVerdict"
            element={<ProtectedRoute element={<InterviewVerdict />} />}
          />
 
          <Route path="/Signup" element={<Signup />} />
          <Route path="/JD" element={<Jobvacancy />} />
          <Route path="/AddJob" element={<AddJob />} />
        </Routes>
      </BrowserRouter>
    </Resumeprovider>
  );
}
 
 
export default App;