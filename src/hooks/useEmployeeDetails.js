import { useState } from 'react';
import { uploadEmployeeDetails } from '../services/EmployeeDetailsService';


// Validators
const validateTextField = (v, label, min, max) => {
  const value = v.trim();

  if (!value) return `${label} is required`;
  if (!/^[A-Za-z\s]+$/.test(value)) return 'Only alphabets allowed';
  if (value.length < min) return `Minimum ${min} characters`;
  if (value.length > max) return `Maximum ${max} characters`;
  return '';
};

const validateEmpID = v => {
  const value = v.trim();

  if (!value) return 'Employee ID is required';
  if (value.length < 3) return 'Minimum 3 characters';
  if (value.length > 50) return 'Maximum 50 characters';
  return '';
};

const validateEmail = v =>
  /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z]{2,})+$/.test(v) ? '' : 'Invalid email';

const validateMobile = v =>
  /^[6-9]\d{9}$/.test(v) ? '' : 'Enter valid 10-digit number';


// Date helper
export const formatDate = d => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const formatDobForApi = ddmmyyyy => {
  const [dd, mm, yyyy] = ddmmyyyy.split('-');
  return `${yyyy}-${mm}-${dd}`;
};




export default function useEmployeeDetails(navigation) {
  const [formData, setFormData] = useState({
    companyName: '',
    empId: '',
    fullName: '',
    dob: '',
    gender: '',
    secondaryPhone: '',
    email: '',
  });

  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dobPickerVisible, setDobPickerVisible] = useState(false);

//  Field change and Inline validation
 const handleChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));

  let error = '';
  if (field === 'companyName') error = validateTextField(value, 'Company name', 3, 20);
  if (field === 'empId') error = validateEmpID(value);
  if (field === 'fullName') error = validateTextField(value, 'Full name', 3, 20);
  if (field === 'secondaryPhone') error = validateMobile(value);
  if (field === 'email') error = validateEmail(value);

  setErrors(prev => ({ ...prev, [field]: error }));
};

  const handleDobConfirm = date => {
    setDobPickerVisible(false);
    handleChange('dob', formatDate(date));
  };

// Full form validation 
  const validateForm = () => {
    const newErrors = {
        companyName: validateTextField(formData.companyName, 'Company name', 3, 20),
        empId: validateEmpID(formData.empId),
        fullName: validateTextField(formData.fullName, 'Full name', 3, 20),
        dob: formData.dob ? '' : 'DOB is required',
        gender: formData.gender ? '' : 'Gender is required',
        secondaryPhone: validateMobile(formData.secondaryPhone),
        email: validateEmail(formData.email),
    };

  setErrors(newErrors);
  return Object.values(newErrors).every(e => !e);
};

// Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      companyName:    formData.companyName,
      empId:          formData.empId,
      fullName:       formData.fullName,
      dob:            formatDobForApi(formData.dob),
      gender:         formData.gender,
      secondaryPhone: formData.secondaryPhone,
      email:          formData.email,
    };

    setSubmitting(true);
    try {
      await uploadEmployeeDetails(payload);
      navigation.replace('OnBoardingScreen');
    } catch (err) {
      console.log('API ERROR:', err.response?.status, err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    submitting,
    dobPickerVisible,
    setDobPickerVisible,
    handleChange,
    handleDobConfirm,
    handleSubmit,
  };
}