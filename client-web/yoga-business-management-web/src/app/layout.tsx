import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/theme";
import HeaderSwitcher from "@/components/organisms/HeaderFooterSwitch"; // Import the HeaderSwitcher
import { ToastProvider } from "@/hooks/useToast";
import Footer from "@/components/molecules/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const inter = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "The Yoga",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <title>The Yoga</title>
        </head>
        <body className={inter.className}>
        <ThemeProvider theme={theme}>
            <AppRouterCacheProvider>
                <CssBaseline />
                <HeaderSwitcher /> {/* Use HeaderSwitcher instead of Header or HeaderV2Course */}
                <ToastProvider>
                    <div style={{ minHeight: "70vh", backgroundColor: "white" }}>
                        {children}
                    </div>
                </ToastProvider>
                <Footer />
            </AppRouterCacheProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
