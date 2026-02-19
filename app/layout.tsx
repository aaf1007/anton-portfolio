import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anton Florendo",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700&family=General+Sans:ital,wght@0,400;0,600;1,400;1,600&family=IBM+Plex+Mono:wght@400;600&display=swap" />
      </head>
      <body
        className="antialiased scroll-smooth"
      >
      <header className="flex justify-center items-center">
        <Navbar />
      </header>
        {children}
      </body>
    </html>
  );
}
