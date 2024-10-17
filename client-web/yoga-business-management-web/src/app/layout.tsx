import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/theme";
import Header from "@/components/organisms/Header";
import { ToastProvider } from "@/hooks/useToast";
import Footer from "@/components/molecules/Footer";
import "slick-carousel/slick/slick.css";

import "slick-carousel/slick/slick-theme.css";

const inter = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <AppRouterCacheProvider>
            <CssBaseline />
            <Header />

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
