// import axios from 'axios';

// // Tạo instance của Axios
// const axiosInstance = axios.create({
//     baseURL: 'https://api.example.com', // Địa chỉ API của bạn
// });

// // Giả sử bạn lưu token trong localStorage
// const getAccessToken = () => localStorage.getItem('access_token');
// const setAccessToken = (token) => localStorage.setItem('access_token', token);
// const removeAccessToken = () => localStorage.removeItem('access_token');

// // Hàm refresh token
// const refreshToken = async () => {
//     try {
//         const response = await axiosInstance.post('/auth/refresh-token', {
//             refresh_token: localStorage.getItem('refresh_token')
//         });
//         const { access_token } = response.data;
//         setAccessToken(access_token); // Cập nhật token mới
//         return access_token;
//     } catch (error) {
//         console.error('Refresh token failed', error);
//         removeAccessToken(); // Nếu refresh token không thành công, xóa token
//         removeRefreshToken();
//         window.location.href = '/login'; // Điều hướng người dùng đến trang đăng nhập
//     }
// };

// // Interceptor Request - Thêm token vào header mỗi yêu cầu
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = getAccessToken();
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Interceptor Response - Kiểm tra lỗi 401 (Token hết hạn)
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response && error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true; // Đánh dấu yêu cầu này đã thử lại
//             const newToken = await refreshToken(); // Làm mới token
//             axiosInstance.defaults.headers['Authorization'] = `Bearer ${newToken}`; // Cập nhật lại token trong header
//             originalRequest.headers['Authorization'] = `Bearer ${newToken}`; // Cập nhật lại token cho yêu cầu gốc
//             return axiosInstance(originalRequest); // Thử lại yêu cầu gốc với token mới
//         }

//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;
