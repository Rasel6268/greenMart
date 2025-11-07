import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import AuthProvider from "@/context/auth/AuthProvider";
import CartProvider from "@/context/cart/CartProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "GreenMart | Wholesale & Retail eCommerce Platform",
    template: "%s | GreenMart",
  },
  description:
    "GreenMart is your trusted eCommerce platform for wholesale and retail shopping. We import quality products directly from China to offer unbeatable prices on electronics, fashion, and more.",
  keywords: [
    "GreenMart",
    "wholesale products",
    "retail shopping",
    "buy from China",
    "China import",
    "online store",
    "bulk order",
    "cheap wholesale",
    "eCommerce Bangladesh",
  ],
  authors: [{ name: "GreenMart Team", url: "https://globalmart.com" }],
  creator: "Web Dev with Rasel",
  publisher: "GreenMart Ltd.",
  metadataBase: new URL("https://greenmart.com"),
  openGraph: {
    title: "GreenMart — Buy Wholesale & Retail Products from China",
    description:
      "Shop high-quality wholesale and retail products directly imported from China. Save more with GreenMart — your trusted online marketplace.",
    url: "https://greenmart.com",
    siteName: "GreenMart",
    images: [
      {
        url: "https://greenmart.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GreenMart eCommerce platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GreenMart | Wholesale & Retail eCommerce Platform",
    description:
      "Buy quality wholesale and retail products from China at unbeatable prices. Explore GreenMart today.",
    images: ["https://greenmart.com/twitter-card.jpg"],
    creator: "@greenmart",
  },
  alternates: {
    canonical: "https://greenmart.com",
  },
  category: "eCommerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <ReactQueryProvider>
              {children}
              <ToastContainer />
            </ReactQueryProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
