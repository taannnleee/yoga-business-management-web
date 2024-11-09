import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['bizweb.dktcdn.net', 'encrypted-tbn0.gstatic.com', "media.istockphoto.com", "yoga.vn", "res.cloudinary.com", "images.pexels.com", "example.com"],

    },
};

export default withNextVideo(nextConfig);