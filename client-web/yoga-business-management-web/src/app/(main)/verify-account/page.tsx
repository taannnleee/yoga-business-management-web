"use client";

import Button from "@/components/atom/Button";
import { Typography, Box, Divider, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import OTPInput from "@/components/atom/OtpInput";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config/url";
import axios from "axios";

interface ILoginPageProps {}

const VerifyAccount: React.FC<ILoginPageProps> = () => {
  const { control, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [email, setEmail] = useState<string | null>(null); // State to store email
  const toast = useToast();
  const router = useRouter();

  // UseEffect to get the email from URL query params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const emailFromUrl = urlParams.get("email");
      setEmail(emailFromUrl);
    }
  }, []);

  const handlePressVerifyAccount = async (values: any) => {
    if (!email) {
      toast.sendToast("Error", "Email is missing", "error");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/api/auth/verifyOTP_register`,
        {},
        {
          params: {
            OTP: values.otp,
            email: email,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setLoading(false);
        toast.sendToast("Success", "Verify user successfully");
        router.replace(`/login`);
      } else {
        setLoading(false);
        toast.sendToast(
          "Error",
          response?.data.message || "Verification failed",
          "error"
        );
      }
    } catch (error) {
      setLoading(false);
      toast.sendToast("Error", "Verification failed", "error");
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.sendToast("Error", "Email is missing", "error");
      return;
    }
    try {
      setIsResendingOtp(true); // Start loading
      const response = await axios.post(
        `${API_URL}/api/auth/send-otp?email=${email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.sendToast("Success", response.data.message);
    } catch (error) {
      toast.sendToast("Error", "Verification failed", "error");
    } finally {
      setIsResendingOtp(false); // End loading
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white relative">
      {isResendingOtp && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <CircularProgress color="inherit" />
        </div>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: "24px",
          width: "500px",
          alignItems: "center",
          padding: "36px 36px",
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: "600" }} variant="h4">
            Verify your account
          </Typography>
          <Typography
            sx={{ marginTop: "16px", fontSize: "14px", color: "GrayText" }}
          >
            We have sent a verification code to your phone number, please enter
            it to verify.
          </Typography>
        </Box>

        <Divider sx={{ height: 4, width: "100%", margin: "4px 0" }} />

        <form
          onSubmit={handleSubmit(handlePressVerifyAccount)}
          className="w-full flex gap-y-6 flex-col"
        >
          <OTPInput
            control={control}
            name="otp"
            label="OTP"
            placeholder="Enter your OTP code"
          />
          <Button
            type="submit"
            variant="primary"
            className="mt-2"
            isLoading={loading}
          >
            Verify your phone number
          </Button>
        </form>

        <Box>
          <Typography sx={{ fontSize: "14px", color: "GrayText" }}>
            {
              "By verifying your account, you agree to The Yoga's Terms of Service and Privacy Policy, as well as the Cookie Policy. This helps us ensure the security and integrity of our platform."
            }
          </Typography>
        </Box>
        <Divider sx={{ height: 4, width: "100%" }} />

        <Box>
          <Typography
            sx={{
              fontSize: "14px",
              color: "GrayText",
              textAlign: "center",
              columnGap: "2px",
            }}
          >
            {"Didn't receive one-time password?"}
            <Typography
              style={{
                marginLeft: "4px",
                marginRight: "4px",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={handleResendOTP}
            >
              Resend OTP
            </Typography>
            After 40s
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default VerifyAccount;
