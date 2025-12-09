export const isValidAadhaar = aadhaar => {
  const regex = /^[2-9][0-9]{11}$/;
  return regex.test(aadhaar);
};

export const isOtpFilled = otp => {
  return otp.every(digit => digit !== '');
};
