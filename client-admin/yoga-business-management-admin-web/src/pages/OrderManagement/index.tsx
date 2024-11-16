import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MainLayout from '../../components/SIdeBar';

interface OrderItem {
    id: number;
    name: string;
    image: string;
    quantity: number;
    totalPrice: string;
    product: Product;
    currentVariant: any;
}

interface Order {
    id: number;
    totalPrice: number;
    totalItem: number;
    createdBy: string;
    status: string;
    payment: Payment;
    orderItems: OrderItem[];
    estatusOrder: string;  // Trạng thái hiện tại của đơn hàng
    createdAt: string;
}

interface Product {
    imagePath: string;
}

interface Payment {
    nameMethod: string;
    epaymentStatus: string;
}

const OrderManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Gọi API để lấy danh sách đơn hàng
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch("http://localhost:8080/api/admin/get-all-order-of-user", {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                setOrders(data.data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`http://localhost:8080/api/admin/update-order-status/${orderId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Cập nhật trạng thái trong local state sau khi thay đổi
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, estatusOrder: newStatus } : order
                )
            );
        } catch (err: any) {
            setError(err.message || "Failed to update order status");
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <MainLayout
            title="Danh sách đơn hàng"
            content={
                <Box p={3}>
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h5" fontWeight="bold">
                            Order List
                        </Typography>
                        <Button variant="contained" color="primary">
                            Add New Vendor
                        </Button>
                    </Box>

                    {/* Search */}
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search..."
                            sx={{ width: 250, mr: 1 }}
                        />
                        <Button variant="contained" color="primary">
                            Search
                        </Button>
                    </Box>

                    {/* Table */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Customer Name</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Payment Status</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Payment Method</TableCell>
                                    <TableCell>Order Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.createdBy}</TableCell>
                                        <TableCell>{order.createdAt}</TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    backgroundColor: "#ffe7e7",
                                                    color: "#d32f2f",
                                                    display: "inline-block",
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                }}
                                            >
                                                {order.payment.epaymentStatus}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{order.totalPrice}</TableCell>
                                        <TableCell>{order.payment.nameMethod}</TableCell>
                                        <TableCell>
                                            {/* Hiển thị trạng thái hiện tại trong dropdown */}
                                            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    value={order.estatusOrder} // Trạng thái hiện tại
                                                    onChange={(e) =>
                                                        handleStatusChange(order.id, e.target.value as string)
                                                    }
                                                    label="Status"
                                                >
                                                    <MenuItem value="PROCESSING">Processing</MenuItem>
                                                    <MenuItem value="COMPLETED">Completed</MenuItem>
                                                    <MenuItem value="CANCELLED">Canceled</MenuItem>
                                                    <MenuItem value="DELIVERING">Delivering</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            }
        />
    );
};

export default OrderManagement;
