export const isValidAadhaar = aadhaar => {
  const regex = /^[2-9][0-9]{3}(\s?[0-9]{4}){2}$/;
  return regex.test(aadhaar);
};

export const isOtpFilled = otp => {
  return otp.every(digit => digit !== '');
};
