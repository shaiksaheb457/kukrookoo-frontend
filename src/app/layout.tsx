import type { Metadata }     from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster }      from "react-hot-toast";
import WhatsAppWidget   from "@/components/ui/WhatsAppWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default:  "KukrooKoo — Farm Fresh, Delivered Fresh",
    template: "%s | KukrooKoo",
  },
  description: "Premium live & fresh chicken delivered with trust. Farm-fresh poultry, country chicken, broiler meat & signature masala — delivered same-day across Andhra Pradesh.",
  keywords: ["fresh chicken", "poultry delivery", "farm fresh chicken", "country chicken", "broiler chicken online", "KukrooKoo", "chicken delivery Andhra Pradesh"],
  openGraph: {
    title: "KukrooKoo — Farm Fresh, Delivered Fresh",
    description: "Premium live & fresh chicken delivered with trust.",
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#1A0A0B",
                  color:      "#FFF8F0",
                  fontFamily: "var(--font-inter)",
                },
                success: {
                  iconTheme: { primary: "#A11217", secondary: "#FFF8F0" },
                },
              }}
            />
            <WhatsAppWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}