"use client";
import React, { useEffect, useState } from "react";
import { API_URL } from "@/config/url";
import axiosInstance from "@/utils/axiosClient";
import { useToast } from "@/hooks/useToast";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Divider,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import LocationCityIcon from "@mui/icons-material/LocationCity";

interface Address {
  id: number;
  houseNumber: string;
  street: string;
  district: string;
  city: string;
  status: string;
  nameDelivery: string;
  phoneNumberDelivery: string;
}

const AddressList: React.FC = () => {
  const toast = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [nameDelivery, setNameDelivery] = useState("");
  const [phoneNumberDelivery, setPhoneNumberDelivery] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${API_URL}/api/address/get-address`
      );
      setAddresses(response.data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);
  const getAddressFromCoords = async (lat: number, lng: number) => {
    // Sử dụng API của Google hoặc OpenStreetMap (Nominatim)
    // Ví dụ với Nominatim (không cần API key, dùng cho demo):
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    return data.address;
  };

  // ...trong component AddressList...
  const handleGetCurrentAddress = async () => {
    if (!navigator.geolocation) {
      toast.sendToast("Error", "Trình duyệt không hỗ trợ định vị.", "error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const address = await getAddressFromCoords(latitude, longitude);
          console.log("Address:", address);
          setHouseNumber(address.house_number || "");
          setStreet(address.quarter || "");
          setDistrict(
            address.city_district || address.county || address.district || ""
          );
          setCity(address.city || address.town || address.state || "");
          toast.sendToast("Success", "Đã lấy địa chỉ hiện tại!");
        } catch {
          toast.sendToast(
            "Error",
            "Không thể lấy địa chỉ từ vị trí này.",
            "error"
          );
        }
      },
      () => {
        toast.sendToast("Error", "Không thể truy cập vị trí.", "error");
      }
    );
  };
  const handleAddClick = () => {
    setIsEditMode(false);
    setSelectedAddress(null);
    setHouseNumber("");
    setStreet("");
    setDistrict("");
    setCity("");
    setNameDelivery("");
    setPhoneNumberDelivery("");
    setIsDefault(false);
    setOpen(true);
  };

  const handleEditClick = (address: Address) => {
    setIsEditMode(true);
    setSelectedAddress(address);
    setHouseNumber(address.houseNumber);
    setStreet(address.street);
    setDistrict(address.district);
    setCity(address.city);
    setNameDelivery(address.nameDelivery);
    setPhoneNumberDelivery(address.phoneNumberDelivery);
    setIsDefault(address.status === "DEFAULT");
    setOpen(true);
  };

  const handleDeleteClick = (address: Address) => {
    setSelectedAddress(address);
    setOpenDeleteConfirm(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAddress(null);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setSelectedAddress(null);
  };

  const handleUpdateAddress = async () => {
    if (selectedAddress) {
      const updatedAddress = {
        ...selectedAddress,
        houseNumber,
        street,
        district,
        city,
        nameDelivery,
        phoneNumberDelivery,
      };

      try {
        await axiosInstance.put(
          `${API_URL}/api/address/update/${selectedAddress.id}`,
          updatedAddress
        );
        if (isDefault && selectedAddress.status !== "DEFAULT") {
          await axiosInstance.post(
            `${API_URL}/api/address/set-default/${selectedAddress.id}`,
            {}
          );
        }
        await fetchAddresses();
        handleClose();
      } catch (error) {
        toast.sendToast("Error", "Cập nhật địa chỉ thất bại", "error");
      }
    }
  };

  const handleCreateAddress = async () => {
    const newAddress = {
      houseNumber,
      street,
      district,
      city,
      status: isDefault ? "DEFAULT" : "NORMAL",
      nameDelivery,
      phoneNumberDelivery,
    };

    try {
      const res = await axiosInstance.post(
        `${API_URL}/api/address/create`,
        newAddress
      );
      if (isDefault && res.data?.data?.id) {
        await axiosInstance.post(
          `${API_URL}/api/address/set-default/${res.data.data.id}`,
          {}
        );
      }
      await fetchAddresses();
      handleClose();
    } catch (error) {
      toast.sendToast("Error", "Thêm địa chỉ thất bại", "error");
    }
  };

  const handleDeleteAddress = async () => {
    if (selectedAddress) {
      try {
        await axiosInstance.delete(
          `${API_URL}/api/address/delete/${selectedAddress.id}`
        );
        await fetchAddresses();
        handleCloseDeleteConfirm();
      } catch (error) {
        toast.sendToast("Error", "Xóa địa chỉ thất bại", "error");
      }
    }
  };

  const validateFields = () => {
    if (
      !nameDelivery ||
      !phoneNumberDelivery ||
      !houseNumber ||
      !street ||
      !district ||
      !city
    ) {
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) {
      toast.sendToast(
        "Error",
        "Vui lòng điền đầy đủ tất cả các trường.",
        "error"
      );
      return;
    }
    if (isEditMode) {
      await handleUpdateAddress();
    } else {
      await handleCreateAddress();
    }
  };

  const handleSetDefaultStatus = async (address: Address) => {
    if (address.status !== "DEFAULT") {
      try {
        await axiosInstance.post(
          `${API_URL}/api/address/set-default/${address.id}`,
          {}
        );
        await fetchAddresses();
      } catch (error) {
        toast.sendToast("Error", "Thiết lập mặc định thất bại", "error");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Danh sách địa chỉ
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddLocationAltIcon />}
          onClick={handleAddClick}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Thêm địa chỉ
        </Button>
      </Box>
      <Grid container spacing={2}>
        {loading ? (
          <Grid item xs={12}>
            <Typography>Đang tải...</Typography>
          </Grid>
        ) : error ? (
          <Grid item xs={12}>
            <Typography color="error">Error: {error}</Typography>
          </Grid>
        ) : addresses.length === 0 ? (
          <Grid item xs={12}>
            <Typography>Chưa có địa chỉ nào.</Typography>
          </Grid>
        ) : (
          addresses.map((address) => (
            <Grid item xs={12} key={address.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 2,
                  bgcolor: address.status === "DEFAULT" ? "#f5faff" : "#fafafa",
                  border:
                    address.status === "DEFAULT"
                      ? "2px solid #1976d2"
                      : "1px solid #eee",
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <CardContent sx={{ flex: 1, p: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PersonIcon sx={{ mr: 1, color: "#1976d2" }} />
                    <Typography sx={{ fontWeight: 600, mr: 2 }}>
                      {address.nameDelivery}
                    </Typography>
                    <PhoneIcon sx={{ mr: 1, color: "#1976d2" }} />
                    <Typography>{address.phoneNumberDelivery}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <HomeIcon sx={{ mr: 1, color: "#1976d2" }} />
                    <Typography>
                      {[
                        address.houseNumber,
                        address.street,
                        address.district,
                        address.city,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                  </Box>
                  {address.status === "DEFAULT" && (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <StarIcon sx={{ color: "#fbc02d", mr: 1 }} />
                      <Typography color="text.secondary" fontWeight={600}>
                        Địa chỉ mặc định
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ ml: "auto" }}>
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(address)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <span>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(address)}
                        disabled={address.status === "DEFAULT"}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Thiết lập mặc định">
                    <span>
                      <IconButton
                        color="warning"
                        onClick={() => handleSetDefaultStatus(address)}
                        disabled={address.status === "DEFAULT"}
                      >
                        {address.status === "DEFAULT" ? (
                          <StarIcon />
                        ) : (
                          <StarBorderIcon />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Dialog thêm/sửa địa chỉ */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {isEditMode ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2} mb={2} mt={2}>
            <TextField
              label="Họ và tên người nhận"
              fullWidth
              value={nameDelivery}
              onChange={(e) => setNameDelivery(e.target.value)}
              InputProps={{ startAdornment: <PersonIcon sx={{ mr: 1 }} /> }}
            />
            <TextField
              label="Số điện thoại"
              fullWidth
              value={phoneNumberDelivery}
              onChange={(e) => setPhoneNumberDelivery(e.target.value)}
              InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1 }} /> }}
            />
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Số nhà"
              fullWidth
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              InputProps={{ startAdornment: <HomeIcon sx={{ mr: 1 }} /> }}
            />
            <TextField
              label="Đường"
              fullWidth
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </Box>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Quận/Huyện"
              fullWidth
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              InputProps={{
                startAdornment: <LocationCityIcon sx={{ mr: 1 }} />,
              }}
            />
            <TextField
              label="Tỉnh/Thành phố"
              fullWidth
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <Button
              variant="outlined"
              startIcon={<MyLocationIcon />}
              onClick={handleGetCurrentAddress}
            >
              Lấy địa chỉ hiện tại
            </Button>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                color="primary"
                disabled={isEditMode && selectedAddress?.status === "DEFAULT"}
              />
            }
            label="Đặt làm địa chỉ mặc định"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Hủy
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa địa chỉ này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteAddress} color="secondary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressList;
