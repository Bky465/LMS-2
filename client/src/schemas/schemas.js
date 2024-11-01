import * as Yup from 'yup';

// Function to dynamically generate Yup validation schema based on formData
export const createValidationSchema = (formData) => {
  const schemaShape = {};

  Object.keys(formData).forEach((key) => {
    // Define rules based on field name or type (e.g., name, email, password, etc.)
    if (key === 'name') {
      schemaShape[key] = Yup.string()
        .required('Name is required')
        .min(4, 'Name must be at least 4 characters');
    } else if (key === 'email') {
      schemaShape[key] = Yup.string()
        .email('Invalid email format')
        .required('Email is required');
    } else if (key === 'password') {
      schemaShape[key] = Yup.string()
        .min(8, 'Password must be at least 6 characters').matches(
          /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)/,
          'Password must contain at least one uppercase letter, one special character, and one number'
        ).required('Password is required')
    } else if (key === 'password_confirmation') {
      schemaShape[key] = Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Password confirmation is required');
    } else if (key === 'otp') {
      schemaShape[key] = Yup.string()
        .matches(/^\d{4}$/, 'OTP must be exactly 4 digits')
        .required('OTP is required'); // Adjust the pattern as needed
    }
  });

  return Yup.object().shape(schemaShape);
};
