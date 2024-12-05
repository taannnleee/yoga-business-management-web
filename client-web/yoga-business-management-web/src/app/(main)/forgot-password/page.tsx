"use client";

import Button from "@/components/atom/Button";
import Input from "@/components/atom/Input";
import { Typography, Box, Divider, CircularProgress } from "@mui/material";
import Image from "next/image";
import { useForm } from "react-hook-form";
import React from "react";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/config/url";
const token = localStorage.getItem("accessToken");

interface ILoginPageProps { }

const ForgotPassWord: React.FC<ILoginPageProps> = (props) => {
    const { control, handleSubmit } = useForm();
    const [loading, setLoading] = React.useState(false);
    const toast = useToast();
    const router = useRouter();


    return (
        <div className="w-full h-auto flex justify-center items-center bg-white">
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




                <Divider sx={{ height: 4, width: "100%", margin: "4px 0" }} />

                <form
                    // onSubmit={handleSubmit(handlePressLogin)}
                    className="w-full flex gap-y-6 flex-col"
                >
                    <Input
                        name="email" // Changed from phoneNumber to username
                        control={control}
                        label="Email"
                        placeholder="Enter your email"
                        rules={{ required: "email is required" }} // Updated error message
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        className="mt-2"
                        isLoading={loading}
                    >
                        Continue with email
                    </Button>

                    <CircularProgress size={24} />
                </form>


            </Box>
        </div>
    );
};

export default ForgotPassWord;
