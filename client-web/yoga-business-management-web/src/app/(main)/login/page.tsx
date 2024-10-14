"use client";

import Button from "@/components/atom/Button";
import Input from "@/components/atom/Input";
import { Typography, Box, Divider, CircularProgress } from "@mui/material";
import Image from "next/image";
import { set, useForm } from "react-hook-form";
import axios from "axios";
import React from "react";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ILoginPageProps {}

const LoginPage: React.FC<ILoginPageProps> = (props) => {
  const { control, handleSubmit } = useForm();
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const router = useRouter();

  const handlePressLogin = async (values: any) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/auth/signin",
        values
      );
      const { success, data, error } = response.data;
      if (success) {
        setLoading(false);
        toast.sendToast("Success", "Login successfully");
      } else {
        setLoading(false);
        toast.sendToast("Error", "Login failed", data?.message);
      }
    } catch (error: any) {
      setLoading(false);
      if (error?.response?.status == 410) {
        router.push(
          `/verify-account?phoneNumber=${(
            values.phoneNumber as string
          ).substring(1)}`
        );
      }
      toast.sendToast(
        "Error",
        error?.response?.data?.message || "Login error",
        "error"
      );
    }
  };

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
        <Box>
          <Typography sx={{ fontWeight: "600" }} variant="h4">
            Sign in
          </Typography>
          <Typography
            sx={{ marginTop: "16px", fontSize: "14px", color: "GrayText" }}
          >
            Welcome to Market Floor, a market places connects retailer and
            customers. Here, you can find a wide variety of products from
            trusted sellers. Enjoy a seamless shopping experience with us.
          </Typography>
        </Box>

        <Button variant="secondary">
          <span>Sign in with Google </span>
          <Image
            alt="google-logo"
            src={require("../../../assets/icons/google.png")}
            width={20}
            height={20}
            style={{ marginLeft: "8px" }}
          />
        </Button>

        <Divider sx={{ height: 4, width: "100%", margin: "4px 0" }} />

        <form
          onSubmit={handleSubmit(handlePressLogin)}
          className="w-full flex gap-y-6 flex-col"
        >
          <Input
            name="phoneNumber"
            control={control}
            label="Phone number"
            placeholder="Enter your phone number"
            rules={{ required: "Phone number is required" }}
          />
          <Input
            control={control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            mode="password"
            rules={{ required: "Password is required" }}
          />
          <Button
            type="submit"
            variant="primary"
            className="mt-2"
            isLoading={loading}
          >
            Continue with phone number
          </Button>

          <CircularProgress size={24} />
        </form>

        <Box>
          <Typography sx={{ fontSize: "14px", color: "GrayText" }}>
            By sign in, you agree to Market Floor's Terms of Service and Privacy
            Policy, as well as the Cookie Policy
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
            Dont have an account?
            <Link
              style={{ marginLeft: "4px", textDecoration: "underline" }}
              href="/create-account"
            >
              Create one
            </Link>
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default LoginPage;
