import { withNextVideo } from "next-video/process";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Disable React's strict mode
    images: {
        domains: [
            'bizweb.dktcdn.net',
            'encrypted-tbn0.gstatic.com',
            "media.istockphoto.com",
            "yoga.vn",
            "res.cloudinary.com",
            "images.pexels.com",
            "example.com"
        ],
        dangerouslyAllowSVG: true,
    },
};

export default withNextVideo(nextConfig);
