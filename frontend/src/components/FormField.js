import React from 'react';
import { TextField } from '@material-ui/core';

const FormField = ({ name, label, type = 'text', formik }) => {
  const fieldProps = formik.getFieldProps(name);

  const showError = formik.touched[name] && Boolean(formik.errors[name]) && formik.values[name] !== '';

  return (
    <TextField
      fullWidth
      margin="normal"
      label={label}
      type={type}
      {...fieldProps}
      error={showError}
      helperText={showError ? formik.errors[name] : ''}
      variant="outlined"
      InputLabelProps={type === 'date' ? { shrink: true } : undefined}
    />
  );
};

export default FormField;
