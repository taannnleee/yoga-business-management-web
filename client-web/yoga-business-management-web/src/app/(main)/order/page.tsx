import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, TextField, Button, Container, Card, CardContent, CardMedia, Grid, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const OrderPage = () => {
    return (
        <div>
            {/* Header Section */}
            <AppBar position="static" style={{ backgroundColor: '#ff4b3a' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

                    </Typography>
                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                    <IconButton color="inherit">
                        <HelpOutlineIcon />
                    </IconButton>
                    <IconButton color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
                    <IconButton color="inherit">
                        <ShoppingCartIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Search and Tabs */}
            <Container sx={{ mt: 2 }}>
                <TextField
                    fullWidth
                    label="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
                    variant="outlined"
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2, bgcolor: '#f5f5f5', padding: 1 }}>
                    <Button>Tất cả</Button>
                    <Button>Chờ thanh toán</Button>
                    <Button>Vận chuyển</Button>
                    <Button>Chờ giao hàng</Button>
                    <Button>Hoàn thành</Button>
                    <Button>Đã hủy</Button>

                </Box>
            </Container>

            {/* Order Details */}
            <Container sx={{ mt: 3 }} >
                <Card sx={{ display: 'flex', mb: 0.5 }}>
                    <CardMedia
                        component="img"
                        sx={{ width: 151 }}
                        image="https://bizweb.dktcdn.net/100/262/937/products/bo-quan-ao-tap-set2260-beyoga-beyoga-xanh-blue.jpg?v=1655289896643"
                        alt="product image"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent>
                            <Typography component="div" variant="h6">
                                Đồ tập yoga
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                Phân loại hàng: Quần áo
                            </Typography>
                            <Typography variant="body1" component="div">
                                x1
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="div">
                                Trả hàng miễn phí 15 ngày
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>

                <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button variant="contained" color="primary">Đã Nhận Hàng</Button>
                    <Button variant="outlined" color="secondary">Yêu Cầu Trả Hàng/Hoàn Tiền</Button>
                    <Button variant="outlined" color="secondary">Liên Hệ Người Bán</Button>
                </Card>
            </Container>
        </div>
    );
};

export default OrderPage;
