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
        <link rel="icon" href="/favicon.ico" sizes="any"/>
        <title>The Yoga</title>
        <link
            rel="icon"
            href="/icon?<generated>"
            type="image/<generated>"
            sizes="<generated>"
        />
    </head>
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
