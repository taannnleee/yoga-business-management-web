"use client";

import Button from "@/components/atom/Button";
import { Typography, Box, Divider, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import React from "react";
import { useToast } from "@/hooks/useToast";
import OTPInput from "@/components/atom/OtpInput";
import { useRouter, useSearchParams } from "next/navigation";

interface ILoginPageProps {}

const VerifyAccount: React.FC<ILoginPageProps> = (props) => {
    const { control, handleSubmit } = useForm();
    const [loading, setLoading] = React.useState(false);
    const toast = useToast();
    const searchParams = useSearchParams();
    const router = useRouter();

    const email = searchParams.get("email");
    const OTP = searchParams.get("OTP");

    const handlePressVerifyAccount = async (values: any) => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:8080/api/auth/verifyOTP_register?OTP=${values.otp}&email=${email}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = await response.json();
            if (response.ok) {
                setLoading(false);
                toast.sendToast("Success", "Verify phone number successfully");
                router.replace(`/login`);
            } else {
                setLoading(false);
                toast.sendToast("Error", result?.message || "Verification failed", "error");
            }
        } catch (error) {
            setLoading(false);
            toast.sendToast("Error", "Verification failed", "error");
        }
    };

    return (
        <div className="w-full h-screen flex justify-center items-center bg-white">
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
                        By verifying your account, you agree to Market Floor's Terms of
                        Service and Privacy Policy, as well as the Cookie Policy. This helps
                        us ensure the security and integrity of our platform.
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
                        Didn't receive one-time password?
                        <Typography
                            style={{
                                marginLeft: "4px",
                                marginRight: "4px",
                                textDecoration: "underline",
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
