"use client";
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

interface Address {
    id: number;
    houseNumber: string;
    street: string;
    district: string;
    city: string;
    status: string; // Ensure that this matches the status types defined in your backend
}

const AddressList: React.FC = () => {
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

    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("http://localhost:8080/api/address/get-address", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch addresses");
            }

            const data = await response.json();
            const listAddress = data.data;
            setAddresses(listAddress);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleAddClick = () => {
        setIsEditMode(false);
        setSelectedAddress(null);
        setHouseNumber("");
        setStreet("");
        setDistrict("");
        setCity("");
        setOpen(true);
    };

    const handleEditClick = (address: Address) => {
        setIsEditMode(true);
        setSelectedAddress(address);
        setHouseNumber(address.houseNumber);
        setStreet(address.street);
        setDistrict(address.district);
        setCity(address.city);
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
        const token = localStorage.getItem("accessToken");

        if (selectedAddress) {
            const updatedAddress = {
                ...selectedAddress,
                houseNumber,
                street,
                district,
                city,
            };

            try {
                await fetch(`http://localhost:8080/api/address/update/${selectedAddress.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedAddress),
                });

                setAddresses((prevAddresses) =>
                    prevAddresses.map((addr) =>
                        addr.id === updatedAddress.id ? updatedAddress : addr
                    )
                );

                handleClose();
            } catch (error) {
                console.error("Error updating address", error);
            }
        }
    };

    const handleCreateAddress = async () => {
        const token = localStorage.getItem("accessToken");

        const newAddress = {
            houseNumber,
            street,
            district,
            city,
            status: false,
        };

        try {
            const response = await fetch("http://localhost:8080/api/address/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(newAddress),
            });

            if (!response.ok) {
                throw new Error("Failed to create address");
            }

            const createdAddress = await response.json();
            if (createdAddress && createdAddress.data) {
                setAddresses((prevAddresses) => [...prevAddresses, createdAddress.data]);
            }

            handleClose();
        } catch (error) {
            console.error("Error creating address", error);
        }
    };

    const handleDeleteAddress = async () => {
        const token = localStorage.getItem("accessToken");

        if (selectedAddress) {
            try {
                await fetch(`http://localhost:8080/api/address/delete/${selectedAddress.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                setAddresses((prevAddresses) =>
                    prevAddresses.filter((addr) => addr.id !== selectedAddress.id)
                );

                handleCloseDeleteConfirm();
            } catch (error) {
                console.error("Error deleting address", error);
            }
        }
    };

    const handleSave = async () => {
        if (isEditMode) {
            await handleUpdateAddress();
        } else {
            await handleCreateAddress();
        }
    };

    const handleSetDefaultStatus = async (address: Address) => {
        const token = localStorage.getItem("accessToken");

        if (address.status !== "DEFAULT") {
            try {
                await fetch(`http://localhost:8080/api/address/set-default/${address.id}`, {
                    method: "POST", // Ensure this matches your backend method
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                // Cập nhật trạng thái địa chỉ
                setAddresses((prevAddresses) =>
                    prevAddresses.map((addr) =>
                        addr.id === address.id ? { ...addr, status: "DEFAULT" } : { ...addr, status: "NORMAL" }
                    )
                );
            } catch (error) {
                console.error("Error setting default address", error);
            }
        }
    };

    return (
        <Box sx={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Danh sách địa chỉ
                </Typography>
                <Button variant="contained" color="primary" onClick={handleAddClick}>
                    Thêm địa chỉ
                </Button>
            </Box>
            <Paper sx={{ padding: "20px" }}>
                {loading ? (
                    <Typography>Đang tải...</Typography>
                ) : error ? (
                    <Typography>Error: {error}</Typography>
                ) : (
                    <List>
                        {addresses.map((address) => (
                            <ListItem key={address.id}>
                                <ListItemText
                                    primary={`${address.houseNumber} ${address.street}, ${address.district}, ${address.city}`}
                                    secondary={address.status === 'DEFAULT' ? "Trạng thái: mặc định" : undefined} // Hiển thị trạng thái nếu là 'DEFAULT'
                                />
                                <ListItemSecondaryAction>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditClick(address)}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        sx={{ marginLeft: 1 }}
                                        onClick={() => handleDeleteClick(address)}
                                        disabled={address.status === 'DEFAULT'}
                                    >
                                        Xóa
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        sx={{ marginLeft: 1 }}
                                        onClick={() => handleSetDefaultStatus(address)} // Gọi hàm thiết lập trạng thái mặc định
                                        disabled={address.status === 'DEFAULT'} // Vô hiệu hóa nút nếu địa chỉ đã là mặc định
                                    >
                                        Thiết lập mặc định
                                    </Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>

            {/* Modal để chỉnh sửa hoặc thêm mới địa chỉ */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditMode ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Số nhà"
                        fullWidth
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Đường"
                        fullWidth
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Quận/Huyện"
                        fullWidth
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Tỉnh/Thành phố"
                        fullWidth
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Xác nhận xóa địa chỉ */}
            <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
                <DialogTitle>Xác nhận xóa địa chỉ</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa địa chỉ này không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteConfirm} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleDeleteAddress} color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddressList;
