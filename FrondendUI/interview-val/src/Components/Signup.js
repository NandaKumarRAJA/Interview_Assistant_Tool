import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import backgroundImage from '../assets/images/backgroundImage.jpg';
import icon from '../assets/images/kanini.png';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AssignmentIndIcon from '@mui/icons-material/Assignment';
import { MenuItem } from '@mui/material';
 
 
const Signup = () => {
  const [username, setUserName] = useState('');
  const [userid, setuserid] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
 
  const [usernameError, setUserNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [roleError, setRoleError] = useState('');
 
 
  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
    setUserNameError('');
  };
 
  const handleEmailChange = (e) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);
 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!enteredEmail || !emailRegex.test(enteredEmail)) {
      setEmailError('Enter a valid email address');
    } else {
      setEmailError('');
    }
  };
 
 
  const handlePasswordChange = (e) => {
    const enteredPassword = e.target.value;
    setPassword(enteredPassword);
 
    if (!enteredPassword || enteredPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else {
      setPasswordError('');
    }
  };
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setRoleError('');
  };
 
 
  const handleSubmit = (e) => {
    e.preventDefault();
 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!username || !email || !password || !emailRegex.test(email) || password.length < 8) {
      if (!username) {
        setUserNameError('Username is required');
      }
      if (!email) {
        setEmailError('Email is required');
      }
      if (!password) {
        setPasswordError('Password is required');
      }
      if (!role) {
        setRoleError('Role is required');
      }
      return;
    }
 
    const signinuser = {
      userid: username,
      username: username,
      email: email,
      password: password,
      roles: [role]
 
    };
 
    console.log(signinuser);
 
 
    fetch('http://127.0.0.1:8000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signinuser),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Signup failed');
        }
        return response.json();
      })
      .then((data) => {
        window.location.href = '/Login';
        setuserid(prevUserId => prevUserId + 1);
        console.log('Signup successful!', data);
      })
      .catch((error) => {
        console.error('Signup error:', error);
      });
  };
 
  return (
    <Grid container component="main" sx={{ height: '100vh', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="userName"
              label="User Name"
              type="text"
              id="username"
              autoComplete="username"
              value={username}
              onChange={handleUserNameChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon />
                  </InputAdornment>
                ),
              }}
            />
            {usernameError && (
              <Typography variant="body2" color="error">
                {usernameError}
              </Typography>
            )}
 
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
 
            />
            {emailError && (
              <Typography variant="body2" color="error">
                {emailError}
              </Typography>
            )}
 
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={handlePasswordChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
 
            {passwordError && (
              <Typography variant="body2" color="error">
                {passwordError}
              </Typography>
            )}
 
            <TextField
              select
              margin="normal"
              required
              fullWidth
              name="role"
              label="Role"
              id="role"
              value={role}
              onChange={handleRoleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AssignmentIndIcon />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="" disabled>
                Select Role
              </MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
            </TextField>
            {roleError && (
              <Typography variant="body2" color="error">
                {roleError}
              </Typography>
            )}
 
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
            <Typography variant="body2" sx={{ mt: 1, fontSize: '1rem', color: 'grey' }}>
              Existing user? <Link to="/Login" style={{ textDecoration: 'none', color: 'blue' }}>Login</Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
      <img
        src={icon}
        alt="Top Left Image"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '200px',
          height: '80px',
          zIndex: 10
        }}
      />
    </Grid>
  );
};
 
export default Signup;