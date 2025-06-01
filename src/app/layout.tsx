import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Keep if you want to use Geist elsewhere
import { Luckiest_Guy } from "next/font/google"; // Import Luckiest Guy
import "./globals.css";

// Setup Luckiest Guy font
const luckiestGuy = Luckiest_Guy({
  weight: '400', // Luckiest Guy only has a 400 weight
  subsets: ["latin"],
  variable: "--font-luckiest-guy", // CSS variable for Luckiest Guy
  display: 'swap',
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "My Awesome Blog", // Updated title
  description: "Stories & ideas to drive business strategy", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* The luckiestGuy.variable class from next/font ensures --font-luckiest-guy is defined */}
      <body className={`${luckiestGuy.variable} antialiased`}> {/* Simplified className */}
        {children}
      </body>
    </html>
  );
}
