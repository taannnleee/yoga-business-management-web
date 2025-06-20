"use client";

import Input from "@/components/atom/Input";
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
  const [isResendingOtp, setIsResendingOtp] = useState(false); // State cho loading toàn màn hình
  const [isVerified, setIsVerified] = useState(false); // Trạng thái xác thực OTP thành công
  const toast = useToast();
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null); // State cho email

  // Lấy email từ query parameters trong URL
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
        `${API_URL}/api/auth/check-otp-change-password`,
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
        setIsVerified(true); // Cập nhật trạng thái khi OTP đúng
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

  const handlePressSendOtp = async () => {
    if (!email) {
      toast.sendToast("Error", "Email is missing", "error");
      return;
    }
    try {
      setIsResendingOtp(true); // Bắt đầu loading
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
      setIsResendingOtp(false); // Kết thúc loading
    }
  };

  const handlePasswordSubmit = async (values: any) => {
    const { password, confirmpassword } = values;

    if (password !== confirmpassword) {
      toast.sendToast("Error", "Passwords do not match", "error");
      return;
    }

    try {
      setLoading(true);

      const bodyData = {
        email: email,
        password: password,
        confirmPassword: confirmpassword,
      };

      const response = await axios.post(
        `${API_URL}/api/auth/forgot-password`,
        bodyData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setLoading(false);
        toast.sendToast("Success", "Password changed successfully");
        router.replace(`/login`);
      } else {
        setLoading(false);
        toast.sendToast(
          "Error",
          response?.data.message || "Password change failed",
          "error"
        );
      }
    } catch (error) {
      setLoading(false);
      toast.sendToast("Error", "An error occurred", "error");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white relative">
      {/* Hiển thị vòng tròn quay nếu đang resend OTP */}
      {isResendingOtp && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999, // Đảm bảo overlay luôn trên cùng
          }}
        >
          <CircularProgress color="primary" />
        </Box>
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
            Forgot password
          </Typography>
          <Typography
            sx={{ marginTop: "16px", fontSize: "14px", color: "GrayText" }}
          >
            We have sent a verification code to your phone number, please enter
            it to verify.
          </Typography>
        </Box>

        <Divider sx={{ height: 4, width: "100%", margin: "4px 0" }} />

        {!isVerified && (
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
              Verify account
            </Button>
          </form>
        )}

        {isVerified && (
          <form
            onSubmit={handleSubmit(handlePasswordSubmit)}
            className="w-full flex gap-y-6 flex-col mt-6"
          >
            <Input
              control={control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              mode="password"
              rules={{ required: "Password is required" }}
            />
            <Input
              name="confirmpassword"
              control={control}
              label="Confirm password"
              placeholder="Confirm password"
              mode="password"
              rules={{ required: "Confirm password is required" }}
            />
            <Button
              type="submit"
              variant="primary"
              className="mt-2"
              isLoading={loading}
            >
              Change Password
            </Button>
          </form>
        )}

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
              role="button"
              onClick={handlePressSendOtp}
              sx={{
                "&:hover": {
                  color: "blue",
                },
              }}
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
