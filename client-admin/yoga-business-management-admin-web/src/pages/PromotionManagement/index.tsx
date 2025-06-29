import React, { useState, ChangeEvent } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import axios from 'axios';
import axiosInstance from 'utils/axiosClient';
import MainLayout from '../../components/SIdeBar';

interface Promotion {
  code: string;
  discount: number;
  discountType: string;
  usage_limit: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}

const PromotionManager: React.FC = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const [promotion, setPromotion] = useState<Promotion>({
    code: '',
    discount: 10,
    discountType: 'PERCENTAGE',
    usage_limit: 100,
    startDate: formatDate(today),        // ✅ mặc định hôm nay
    expiryDate: formatDate(tomorrow),    // ✅ mặc định ngày mai
    isActive: true,
  });
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Lấy ngày hiện tại và định dạng cho thuộc tính min
  const currentDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setPromotion({ ...promotion, [name]: value });
  };

  // Hàm handleChange cho Select
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setPromotion({ ...promotion, [name]: value });
  };

  // Kiểm tra và chỉ cho phép nhập số dương cho Giảm Giá
  const handleDiscountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Chỉ cho phép giá trị là số dương
    if (value === '' || (/^\d{1,3}$/.test(value) && +value >= 1 && +value <= 100)) {
      setPromotion({ ...promotion, discount: parseFloat(value) });
    }
  };

  const handleUseLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Chỉ cho phép giá trị là số dương
    if (value === '' || /^[0-9]*$/.test(value)) {
      setPromotion({ ...promotion, usage_limit: value ? parseInt(value, 10) : 0 });
    }
  };

  const validateForm = () => {
    const startDate = new Date(promotion.startDate);
    const expiryDate = new Date(promotion.expiryDate);

    // Ngày kết thúc phải sau ngày bắt đầu ít nhất 1 ngày
    const oneDayLater = new Date(startDate);
    oneDayLater.setDate(startDate.getDate() + 1);

    if (expiryDate < oneDayLater) {
      setError('Ngày kết thúc phải sau ngày bắt đầu ít nhất một ngày.');
      return false;
    }

    if (expiryDate < new Date()) {
      setError('Ngày kết thúc phải trong tương lai.');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!promotion.discount || !promotion.startDate || !promotion.expiryDate) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!validateForm()) {
      return; // Dừng nếu có lỗi validation
    }

    try {
      // Gửi yêu cầu tạo khuyến mãi tới backend
      const response = await axiosInstance.post('/api/admin/create-promotion', {
        code: promotion.code,
        discount: promotion.discount,
        discountType: promotion.discountType,
        usage_limit: promotion.usage_limit,
        startDate: promotion.startDate,
        expiryDate: promotion.expiryDate,
        isActive: promotion.isActive,
      });

      if (response.status === 200) {
        setMessage('Khuyến mãi đã được tạo thành công!');
        setError('');
        setPromotion({
          code: '',
          discount: 10,
          discountType: 'PERCENTAGE',
          usage_limit: 100,
          startDate: formatDate(today),        // ✅ mặc định hôm nay
          expiryDate: formatDate(tomorrow),
          isActive: true,
        });
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tạo khuyến mãi');
      setMessage('');
    }
  };

  return (
    <MainLayout
      title="Quản lý khuyến mãi"
      content={
        <Box sx={{ padding: 3 }}>
          <Typography variant="h4" gutterBottom>
            Tạo Khuyến Mãi Mới
          </Typography>

          {/* Thông báo lỗi hoặc thành công */}
          {message && <Typography color="green">{message}</Typography>}
          {error && <Typography color="red">{error}</Typography>}

          {/* Form tạo khuyến mãi */}
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Mã Khuyến Mãi */}
            {/* <TextField
                    label="Mã Khuyến Mãi"
                    variant="outlined"
                    fullWidth
                    name="code"
                    value={promotion.code}
                    onChange={handleChange}
                /> */}

            {/* Giảm Giá */}
            <TextField
              label="Giảm Giá (%)"
              variant="outlined"
              fullWidth
              type="number"
              name="discount"
              value={promotion.discount}
              onChange={handleDiscountChange} // Sử dụng hàm kiểm tra số dương
            />

            {/* Loại Giảm Giá */}
            <FormControl fullWidth>
              <InputLabel id="discount-type-label">Loại Giảm Giá</InputLabel>
              <Select
                labelId="discount-type-label"
                name="discountType"
                value={promotion.discountType}
                onChange={handleSelectChange} // Sử dụng hàm mới cho Select
                label="Loại Giảm Giá"
              >
                <MenuItem value="PERCENTAGE">Phần Trăm</MenuItem>
                {/* <MenuItem value="AMOUNT">Số Tiền</MenuItem> */}
              </Select>
            </FormControl>

            {/* Số Lượng Sử Dụng */}
            <TextField
              label="Số Lượng Sử Dụng"
              variant="outlined"
              fullWidth
              type="number"
              name="usage_limit"
              value={promotion.usage_limit === 0 ? '' : promotion.usage_limit}
              onChange={handleUseLimitChange}
            />

            {/* Ngày Bắt Đầu */}
            <TextField
              label="Ngày Bắt Đầu"
              variant="outlined"
              fullWidth
              type="date"
              name="startDate"
              value={promotion.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              // Thêm thuộc tính min để ngày bắt đầu không thể là ngày trong quá khứ
              inputProps={{ min: currentDate }}
            />

            {/* Ngày Kết Thúc */}
            <TextField
              label="Ngày Kết Thúc"
              variant="outlined"
              fullWidth
              type="date"
              name="expiryDate"
              value={promotion.expiryDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: promotion.startDate
                  ? new Date(new Date(promotion.startDate).getTime() + 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0]
                  : currentDate,
              }}
            />

            {/* Nút Gửi */}
            <Button variant="contained" onClick={handleSubmit} sx={{ marginTop: 2 }}>
              Tạo Khuyến Mãi
            </Button>
          </Box>
        </Box>
      }
    />

  );
};

export default PromotionManager;
