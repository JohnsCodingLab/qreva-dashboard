import * as yup from 'yup';

const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  loginAs: yup
    .string()
    .oneOf(['admin', 'regional_manager', 'state_manager', 'aggregator', 'aggregator_manager'])
    .required('Please select login role'),
});

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),
});

const resetPasswordSchema = yup.object({
  otp: yup
    .string()
    .required('OTP is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

const twoFactorSchema = yup.object({
  code: yup
    .string()
    .required('Enter your authenticator code')
    .min(6, 'Enter your 6-digit code or an 8-character backup code')
    .trim(),
});

const ownershipOtpSchema = yup.object({
  otp: yup
    .string()
    .required('OTP is required'),
});

const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Current password is required')
    .min(6, 'Password must be at least 6 characters'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters')
    .notOneOf(
      [yup.ref('currentPassword')],
      'New password must be different from current password'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});


export {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  twoFactorSchema,
  ownershipOtpSchema,
};
