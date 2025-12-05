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

  // ======== INPUT CHANGE HANDLER ========
  const handleChange = (value, index) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // -------- HANDLE PASTE (multi character) --------
    if (value.length > 1) {
      const chars = value.split("");

      const newOtp = [...otp];
      let cursorPos = index;

      chars.forEach((char) => {
        if (cursorPos < length) {
          newOtp[cursorPos] = char;
          cursorPos++;
        }
      });

      setOtp(newOtp);

      // Move focus to last pasted digit
      const next = Math.min(cursorPos, length - 1);
      inputRefs.current[next]?.focus();
      return;
    }

    // -------- NORMAL SINGLE DIGIT INPUT --------
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move to next
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto move backward if input cleared
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
