import { useState, useRef, useEffect } from "react";

export const useOtp = (length = 6) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);
  const [lastBackspaceTime, setLastBackspaceTime] = useState(0);

  // Auto focus first input on mount
  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 200);
  }, []);

  // ======== RESET OTP ========
  const clearOtp = () => {
    setOtp(Array(length).fill(""));
    inputRefs.current[0]?.focus();
  };

  // ======== AUTO-FILL SUPPORT ========
  const setOtpFromAutoFill = (value) => {
    if (!value) return;

    if (value.length === length) {
      setOtp(value.split(""));
      inputRefs.current[length - 1]?.blur(); // remove focus after autofill
    }
  };

 const handleChange = (text, index) => {
  // Remove non-numeric characters
  const cleanedText = text.replace(/[^0-9]/g, '');

  //  Handle full OTP paste
  if (cleanedText.length > 1) {
    const otpArray = cleanedText.slice(0, 6).split('');

    const newOtp = [...otp];

    otpArray.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });

    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = otpArray.length - 1;
    if (inputRefs.current[lastIndex]) {
      inputRefs.current[lastIndex].focus();
    }

    return;
  }

  // Normal single digit entry
  const newOtp = [...otp];
  newOtp[index] = cleanedText;
  setOtp(newOtp);

  // Move to next input
  if (cleanedText && index < otp.length - 1) {
    inputRefs.current[index + 1]?.focus();
  }
};
  // ======== BACKSPACE HANDLER ========
  const handleKeyPress = (e, index) => {
    const key = e.nativeEvent.key;

    if (key === "Backspace") {
      const now = Date.now();

      // Detect rapid backspace = clear all
      if (now - lastBackspaceTime < 80) {
        clearOtp();
        return;
      }

      setLastBackspaceTime(now);

      // Normal backspace handling
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return {
    otp,
    setOtp,
    inputRefs,
    handleChange,
    handleKeyPress,
    clearOtp,
    setOtpFromAutoFill, // required for iOS & Android SMS autofill
  };
};
