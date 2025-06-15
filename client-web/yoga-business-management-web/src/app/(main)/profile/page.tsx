"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosClient";
import {
  Box,
  RadioGroup,
  FormControlLabel,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Radio,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import PersonIcon from "@mui/icons-material/Person";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LockIcon from "@mui/icons-material/Lock";
import { API_URL } from "@/config/url";
import { useToast } from "@/hooks/useToast";
import dynamic from "next/dynamic";
import "tailwindcss/tailwind.css";

const OrderPage = dynamic(() => import("@/app/(main)/order/page"), {
  ssr: false,
});
const WishList = dynamic(() => import("@/app/(main)/wishlist/page"), {
  ssr: false,
});
const AddressList = dynamic(() => import("@/app/(main)/address/page"), {
  ssr: false,
});

const menuItems = [
  { label: "Thông tin khách hàng", value: "accountInfo", icon: <PersonIcon /> },
  { label: "Đổi mật khẩu", value: "changePassword", icon: <LockIcon /> },
  { label: "Đơn hàng của tôi", value: "orders", icon: <ListAltIcon /> },
  { label: "Sản phẩm yêu thích", value: "saved", icon: <FavoriteBorderIcon /> },
  { label: "Danh sách địa chỉ", value: "address", icon: <LocationOnIcon /> },
];
const AccountInfo: React.FC = () => {
  const toast = useToast();
  const searchParams = useSearchParams();
  const savedTab = searchParams.get("savedTab");
  const [activeTab, setActiveTab] = useState<string>(savedTab || "accountInfo");
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProfileUpdated, setIsProfileUpdated] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    imagePath: "",
    gender: "",
    dateOfBirth: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const isPhoneValid = (phone: string) => /^0\d{9}$/.test(phone);
  useEffect(() => {
    const handleTabChange = () => {
      const tab = localStorage.getItem("profileTab");
      if (tab) {
        setActiveTab(tab);
        localStorage.removeItem("profileTab");
      }
    };
    window.addEventListener("profile-tab-changed", handleTabChange);
    handleTabChange();
    return () => {
      window.removeEventListener("profile-tab-changed", handleTabChange);
    };
  }, []);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${API_URL}/api/user/get-profile`
        );
        setProfileData(response.data.data);
        const formattedDateOfBirth = response.data.data.dateOfBirth
          ? new Date(response.data.data.dateOfBirth).toISOString().split("T")[0]
          : "";
        setFormData({
          firstName: response.data.data.firstName || "",
          lastName: response.data.data.lastName || "",
          email: response.data.data.email || "",
          phone: response.data.data.phone || "",
          imagePath: response.data.data.imagePath || "",
          gender: response.data.data.gender || "",
          dateOfBirth: formattedDateOfBirth || "",
        });
      } catch {
        toast.sendToast("Error", "Failed to load profile data.", "error");
      } finally {
        console.log("Profile data imagePath:", formData.imagePath);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const hasChanges = () =>
    formData.firstName !== profileData?.firstName ||
    formData.lastName !== profileData?.lastName ||
    formData.email !== profileData?.email ||
    formData.phone !== profileData?.phone ||
    formData.imagePath !== profileData?.imagePath ||
    formData.gender !== profileData?.gender ||
    formData.dateOfBirth !== profileData?.dateOfBirth;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      setIsProfileUpdated(false);
      return { ...prev, [name]: value };
    });
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => {
      setIsProfileUpdated(false);
      return { ...prev, gender: event.target.value };
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      try {
        const response = await axiosInstance.post(
          `${API_URL}/api/image/upload`,
          formDataObj,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setFormData((prev) => ({
          ...prev,
          imagePath: response.data.data.url,
        }));
      } catch {
        toast.sendToast("Error", "Failed to upload image.", "error");
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (!isPhoneValid(formData.phone)) {
      setPhoneError("Phone number is invalid. It must be a 10-digit number.");
      return;
    } else {
      setPhoneError("");
    }
    try {
      await axiosInstance.post(`${API_URL}/api/user/update-profile`, formData);
      toast.sendToast("Success", "Profile updated successfully!");
      setIsProfileUpdated(true);
    } catch {
      toast.sendToast("Error", "Failed to update profile.", "error");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async () => {
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      toast.sendToast(
        "Error",
        "New password cannot be the same as the current password.",
        "error"
      );
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.sendToast(
        "Error",
        "New password and confirm new password must match.",
        "error"
      );
      return;
    }
    if (passwordForm.newPassword.length > 50) {
      toast.sendToast(
        "Error",
        "Password cannot be longer than 50 characters.",
        "error"
      );
      return;
    }
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,50}$/;
    if (!passwordRegex.test(passwordForm.newPassword)) {
      toast.sendToast(
        "Error",
        "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.",
        "error"
      );
      return;
    }
    try {
      await axiosInstance.post(`${API_URL}/api/user/change-password`, {
        password: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmNewPassword,
      });
      toast.sendToast("Success", "Password changed successfully");
      await axiosInstance.post(`${API_URL}/api/auth/logout`, {});
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      window.location.href = "/login";
    } catch {
      toast.sendToast("Error", "Password incorrect", "error");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", p: 4, bgcolor: "#fff", borderRadius: 3 }}>
      {/* Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: 260,
          mr: 4,
          p: 2,
          bgcolor: "#fafafa",
          borderRadius: 3,
          minHeight: 500,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Settings
        </Typography>
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.value}
              button
              selected={activeTab === item.value}
              onClick={() => setActiveTab(item.value)}
              sx={{
                mb: 1,
                borderRadius: 2,
                bgcolor: activeTab === item.value ? "#f3f4f6" : "inherit",
                color: activeTab === item.value ? "#111" : "#555",
                fontWeight: activeTab === item.value ? 600 : 400,
                "&:hover": { bgcolor: "#f3f4f6" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "#222" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 15,
                  fontWeight: activeTab === item.value ? 600 : 400,
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Main content */}
      <Box sx={{ flex: 1, pl: 2 }}>
        {activeTab === "accountInfo" && (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              About you
            </Typography>
            <Box display="flex" alignItems="center" mb={4}>
              <Avatar
                alt="User Avatar"
                src={formData.imagePath || "/avatar-placeholder.png"}
                sx={{ width: 80, height: 80, mr: 3 }}
              />
              <Button variant="outlined" component="label" sx={{ height: 40 }}>
                Upload image
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              <Typography variant="body2" sx={{ ml: 2, color: "#888" }}>
                *.png, *.jpeg files up to 10MB
              </Typography>
            </Box>
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap={2}
              mb={2}
              sx={{ maxWidth: 600 }}
            >
              <TextField
                label="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                variant="outlined"
                disabled
                fullWidth
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                error={!!phoneError}
                helperText={phoneError}
              />
            </Box>
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap={2}
              sx={{ maxWidth: 600 }}
            >
              <TextField
                label="Birth date (optional)"
                name="dateOfBirth"
                type="date"
                variant="outlined"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputProps: {
                    max: new Date().toISOString().split("T")[0],
                  },
                }}
                fullWidth
              />
            </Box>
            <Box mt={3}>
              <Typography variant="subtitle1" gutterBottom>
                Gender
              </Typography>
              <RadioGroup
                row
                value={formData.gender}
                onChange={handleGenderChange}
              >
                <FormControlLabel
                  value="MALE"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="FEMALE"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="OTHER"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </Box>
            <Box mt={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateProfile}
                disabled={!hasChanges() || isProfileUpdated}
                sx={{
                  borderRadius: 8,
                  px: 4,
                  fontWeight: 600,
                  fontSize: 16,
                  bgcolor: "#222",
                  "&:hover": { bgcolor: "#111" },
                }}
              >
                Update profile
              </Button>
            </Box>
          </Box>
        )}
        {activeTab === "changePassword" && (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Change Password
            </Typography>
            <Box
              display="grid"
              gridTemplateColumns="1fr"
              gap={2}
              mt={2}
              sx={{ maxWidth: 400 }}
            >
              <TextField
                label="Current Password"
                type="password"
                variant="outlined"
                fullWidth
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
              />
              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                variant="outlined"
                fullWidth
                name="confirmNewPassword"
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordChange}
              />
            </Box>
            <Box mt={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleChangePassword}
                sx={{
                  borderRadius: 8,
                  px: 4,
                  fontWeight: 600,
                  fontSize: 16,
                  bgcolor: "#222",
                  "&:hover": { bgcolor: "#111" },
                }}
              >
                Save Password
              </Button>
            </Box>
          </Box>
        )}
        {activeTab === "orders" && <OrderPage />}
        {activeTab === "saved" && <WishList />}
        {activeTab === "address" && <AddressList />}
      </Box>
    </Box>
  );
};

export default AccountInfo;
