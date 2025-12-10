import React from 'react';
import { Container, Typography, Button, Tabs, Tab, Card, CardContent, Grid, InputAdornment } from '@material-ui/core';
import { AccountCircle, Lock } from '@material-ui/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tab, setTab] = React.useState(0);

  const voterFormik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({ email: Yup.string().email().required(), password: Yup.string().required() }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, values);
        login(res.data.token, 'voter');
        navigate('/voter-dashboard');
      } catch (err) {
        alert(err.response.data.error);
      }
    },
  });

  const ecFormik = useFormik({
    initialValues: { email: 'ec@referendum.gov.sr', password: '' },
    validationSchema: Yup.object({ email: Yup.string().required(), password: Yup.string().required() }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/ec/login`, values);
        login(res.data.token, 'ec');
        navigate('/ec-dashboard');
      } catch (err) {
        alert(err.response.data.error);
      }
    },
  });

  return (
    <Container maxWidth="sm" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)' }}>
      <Typography variant="h3" align="center" gutterBottom color="primary">
        My Shangri-La Referendum
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Secure voting for a better future
      </Typography>
      <Card elevation={6}>
        <CardContent>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} centered indicatorColor="primary" textColor="primary">
            <Tab label="Voter" />
            <Tab label="Election Commission" />
          </Tabs>
          {tab === 0 ? (
            <form onSubmit={voterFormik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormField name="email" label="Email" formik={voterFormik} 
                    InputProps={{ startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12}>
                  <FormField name="password" label="Password" type="password" formik={voterFormik} 
                    InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                  <Typography variant="body2">
                    Don't have an account? <Link to="/register" style={{ color: '#2980b9' }}>Register here</Link>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          ) : (
            <form onSubmit={ecFormik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormField name="email" label="Email" formik={ecFormik} disabled 
                    InputProps={{ startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12}>
                  <FormField name="password" label="Password" type="password" formik={ecFormik} 
                    InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }} />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
                </Grid>
              </Grid>
            </form>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;