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
    default: "GreenStoreBD | Wholesale & Retail eCommerce Platform",
    template: "%s | GreenStoreBD",
  },
  description:
    "GreenStoreBD is your trusted eCommerce platform for wholesale and retail shopping. We import quality products directly from China to offer unbeatable prices on electronics, fashion, and more.",
  keywords: [
    "GreenStoreBD",
    "wholesale products",
    "retail shopping",
    "buy from China",
    "China import",
    "online store",
    "bulk order",
    "cheap wholesale",
    "eCommerce Bangladesh",
  ],
  authors: [{ name: "GreenStoreBD Team", url: "https://greenstorebd.com" }],
  creator: "Web Dev with Rasel",
  publisher: "GreenStoreBD Ltd.",
  metadataBase: new URL("https://greenstorebd.com"),
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  openGraph: {
    title: "GreenStoreBD — Buy Wholesale & Retail Products from China",
    description:
      "Shop high-quality wholesale and retail products directly imported from China. Save more with GreenStoreBD — your trusted online marketplace.",
    url: "https://greenstorebd.com",
    siteName: "GreenStoreBD",
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "GreenStoreBD eCommerce platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GreenStoreBD | Wholesale & Retail eCommerce Platform",
    description:
      "Buy quality wholesale and retail products from China at unbeatable prices. Explore GreenStoreBD today.",
    images: ["/icon.png"],
    creator: "@greenmart",
  },
  alternates: {
    canonical: "https://greenstorebd.com",
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
