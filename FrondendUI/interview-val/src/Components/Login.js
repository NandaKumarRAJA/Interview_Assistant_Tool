import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../assets/images/backgroundImage.jpg';
import icon from '../assets/images/kanini.png';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';


const errorStyle = {
  color: 'red',
  fontSize: '0.75rem', 
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
 
  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleEmailChange = (e) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!enteredEmail) {
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Email is required' }));
    } else if (!emailRegex.test(enteredEmail)) {
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Enter a valid email address' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
    }
  };
  const validatePassword = (value) => {
    const minLength = 8;
    const newErrors = {};
 
    if (!value) {
      newErrors.password = 'Password is required';
    } else if (value.length < minLength) {
      newErrors.password = `Password must be at least ${minLength} characters long`;
    }
 
    setErrors(newErrors);
  };
 
  const validateForm = () => {
    const newErrors = {};
 
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    validatePassword(password);

    if (!password) {
      newErrors.password = 'Password is required';
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      logindata();
    }
  };
 
  const logindata = () => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
  
    fetch(`http://127.0.0.1:8000/token`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Login successfully');
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('Role', data.roles);
        sessionStorage.setItem('token', data.access_token);
        console.log(sessionStorage.getItem('Role'));
        if (sessionStorage.getItem('email') !== null) {
          window.location.href = '/Home';
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        toast.error('Login failed. Please check your credentials.');
      });
  };
  return (
    <>
      <Grid container component="main" sx={{ height: '100vh' }}>
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
              Log in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: '100%' }}
            >
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
              {errors.email && (
                <span className="error" style={errorStyle}>
                  {errors.email}
                </span>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => handlePasswordChange(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {errors.password && (
                <span className="error" style={errorStyle}>
                  {errors.password}
                </span>
              )}
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="#" variant="body2" style={{ marginRight: '1rem', textDecoration: 'none', color: 'blue' }}>
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Grid container spacing={2}>
              <Typography variant="body2" sx={{ mt: 3, ml:2, fontSize: '1rem', color: 'grey' }}>
              New user? <Link to="/Signup" style={{ textDecoration: 'none', color: 'blue' }}>Sign Up</Link>
            </Typography>
              </Grid>
              <Box mt={5} />
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
            zIndex: 10,
          }}
        />
      </Grid>
      <ToastContainer />
    </>
  );
};
 
 
export default Login;
