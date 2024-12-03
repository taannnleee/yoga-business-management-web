import { useRouter } from 'next/navigation';

const useFetchWithAuth = () => {
    const router = useRouter();

    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        const token = localStorage.getItem("accessToken");

        // Kiểm tra token trước khi gửi yêu cầu
        if (!token) {
            router.push('/login'); // Điều hướng đến trang home nếu không có token
            return;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`, // Thêm token vào header
                },
            });

            if (response.status === 401) {
                // Nếu token không hợp lệ (401 Unauthorized), điều hướng đến trang đăng nhập
                localStorage.removeItem('accessToken'); // Xóa token để tránh các yêu cầu sau này
                router.push('/login'); // Điều hướng đến trang home (hoặc trang đăng nhập)
                return;
            }

            return response.json(); // Trả về dữ liệu phản hồi khi thành công
        } catch (error) {
            console.error("Error fetching data:", error);
            router.push('/login'); // Điều hướng đến trang home nếu có lỗi xảy ra
        }
    };

    return fetchWithAuth;
};
