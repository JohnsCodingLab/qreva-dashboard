import { useState } from 'react';
import { loginSchema } from '@/pages/auth/schema';
import { validateField } from '@/pages/auth/utils/inputHelpers';

export const useLoginForm = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });

  const updateField = (fieldName, value) => {
    setCredentials(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleBlur = async (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = await validateField(loginSchema, fieldName, credentials[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: error || '' }));
  };

  const validateForm = async () => {
    try {
      await loginSchema.validate(credentials, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach(err => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
      setTouched({ email: true, password: true });
      return { isValid: false, errors: validationErrors };
    }
  };

  const isFieldValid = (fieldName) => {
    return credentials[fieldName] && !errors[fieldName];
  };

  const isFormValid = () => {
    return credentials.email && 
           credentials.password && 
           !errors.email && 
           !errors.password;
  };

  return {
    credentials,
    errors,
    touched,
    updateField,
    handleBlur,
    validateForm,
    isFieldValid,
    isFormValid,
  };
};