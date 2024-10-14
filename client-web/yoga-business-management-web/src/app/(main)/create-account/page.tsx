"use client";

import Button from "@/components/atom/Button";
import Input from "@/components/atom/Input";
import { Typography, Box, Divider, CircularProgress } from "@mui/material";
import Image from "next/image";
import { useForm } from "react-hook-form";
import axios from "axios";
import React from "react";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ICreateAccountPageProps {}

const CreateAccountPage: React.FC<ICreateAccountPageProps> = (props) => {
  const {
    control,
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const router = useRouter();

  const handlePressRegister = async (values: any) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/create-account",
        {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          password: values.password,
          role: "user",
          username: values.username,
        }
      );
      const { success, data, error } = response.data;
      if (success) {
        setLoading(false);
        toast.sendToast("Success", "Sign up successfully");
        router.replace(
          `/verify-account?phoneNumber=${(
            values.phoneNumber as string
          ).substring(1)}`
        );
      } else {
        setLoading(false);
        toast.sendToast("Error", data?.message, "error");
      }
    } catch (error: any) {
      console.log("current error is", error);
      setLoading(false);
      toast.sendToast(
        "Error",
        error?.response?.data?.message || "Register error",
        "error"
      );
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
            Create account
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
          onSubmit={handleSubmit(handlePressRegister)}
          className="w-full flex gap-y-6 flex-col"
        >
          <div className="w-full grid grid-cols-2 gap-x-2">
            <Input
              control={control}
              name="firstName"
              label="First Name"
              placeholder="Enter your first name"
              rules={{ required: "First name is required" }}
            />
            <Input
              control={control}
              name="lastName"
              label="Last Name"
              placeholder="Enter your last name"
              rules={{ required: "Last name is required" }}
            />
          </div>

          <Input
            name="username"
            control={control}
            label="Username"
            placeholder="Enter your username"
            rules={{ required: "Username is required" }}
          />
          <Input
            name="email"
            control={control}
            label="Email"
            placeholder="Enter your email address"
            rules={{ required: "Email is required" }}
          />
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
            label="Mật khẩu"
            placeholder="Nhập mật khẩu của bạn"
            mode="password"
            rules={{ required: "Password is required" }}
          />
          <Input
            control={control}
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu của bạn"
            mode="password"
            rules={{
              required: "Confirm password is required",
              validate: (value: any) =>
                value === getValues("password") || "Passwords do not match",
            }}
          />
          <Button
            type="submit"
            variant="primary"
            className="mt-2 w-full"
            isLoading={loading}
          >
            Create your account
          </Button>
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
            Already have an account?
            <Link
              style={{ marginLeft: "4px", textDecoration: "underline" }}
              href="/login"
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default CreateAccountPage;
