"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, Button } from "@mui/material";
import axios from "axios";

interface Address {
    id: number; // ID của địa chỉ
    houseNumber: string;
    street: string;
    district: string;
    city: string;
    status: boolean;
}

const AddressList: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);

    // Hàm lấy danh sách địa chỉ từ backend
    const fetchAddresses = async () => {
        try {
            const response = await axios.get("/api/addresses"); // Thay thế bằng API thực tế của bạn
            setAddresses(response.data);
        } catch (error) {
            console.error("Error fetching addresses", error);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    return (
        <Box sx={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <Typography variant="h4" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
                Danh sách địa chỉ
            </Typography>
            <Paper sx={{ padding: "20px" }}>
                <List>
                    {addresses.map((address) => (
                        <ListItem key={address.id}>
                            <ListItemText
                                primary={`${address.houseNumber} ${address.street}, ${address.district}, ${address.city}`}
                                secondary={`Trạng thái: ${address.status ? "Kích hoạt" : "Không kích hoạt"}`}
                            />
                            <ListItemSecondaryAction>
                                <Button variant="outlined" color="primary">
                                    Chỉnh sửa
                                </Button>
                                <Button variant="outlined" color="secondary" sx={{ marginLeft: 1 }}>
                                    Xóa
                                </Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default AddressList;
