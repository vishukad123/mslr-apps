import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/FormField';

const Register = () => {
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);

  const today = new Date();

  const formik = useFormik({
    initialValues: { email: '', name: '', dob: '', password: '', scc: '' },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email format')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must have a valid domain')
        .required('Email is required'),
      name: Yup.string()
        .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .required('Full name is required'),
      dob: Yup.date()
        .required('Date of birth is required')
        .max(today, 'Date of birth cannot be in the future')
        .test('age', 'You must be at least 18 years old', value => {
          if (!value) return false;
          const dob = new Date(value);
          const ageDifMs = today - dob;
          const ageDate = new Date(ageDifMs);
          return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
        }),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must have at least one uppercase letter')
        .matches(/[a-z]/, 'Password must have at least one lowercase letter')
        .matches(/\d/, 'Password must have at least one number')
        .matches(/[!@#$%^&*]/, 'Password must have at least one special character (!@#$%^&*)')
        .required('Password is required'),
      scc: Yup.string()
      .matches(/^[A-Za-z0-9]{10}$/, 'SCC must be exactly 10 alphanumeric characters')
      .required('SCC is required'),

    }),
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, values);
        navigate('/login');
      } catch (err) {
        alert(err.response?.data?.error || 'Something went wrong');
      }
    },
  });


  // Update form validity for submit button
  useEffect(() => {
    setIsFormValid(formik.isValid && formik.dirty);
  }, [formik.values, formik.errors, formik.isValid, formik.dirty]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Register</Typography>
      <form onSubmit={formik.handleSubmit}>
        <FormField name="email" label="Email" formik={formik} />
        <FormField name="name" label="Full Name" formik={formik} />
        <FormField name="dob" label="Date of Birth" type="date" formik={formik} />
        <FormField name="password" label="Password" type="password" formik={formik} />
        <FormField name="scc" label="SCC" formik={formik} />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!isFormValid}
        >
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;
