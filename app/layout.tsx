import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { Toaster } from "react-hot-toast";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ILOSUNOT JEISO HOME APPLIANCE",
  description: "Premium home appliances for your home - Refrigeration, Kitchen, Cooking, Laundry, and Small Appliances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
          <WhatsAppFloatingButton />
        </AuthProvider>
      </body>
    </html>
  );
}
