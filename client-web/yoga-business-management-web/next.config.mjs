import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['bizweb.dktcdn.net', 'encrypted-tbn0.gstatic.com',"media.istockphoto.com", "yoga.vn"], // Thêm hostname bạn cần vào đây
    },
};

export default withNextVideo(nextConfig);