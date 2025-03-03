"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/organisms/Hero";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomePage from "@/app/(main)/home/page";

export default function Home() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            router.replace("/home");
        } else {
            router.replace("/login");
        }

        setIsChecking(false); // Đánh dấu đã kiểm tra xong
    }, [router]);

    // Không render HomePage khi đang kiểm tra redirect
    if (isChecking) return null;

    return <HomePage />;
}
