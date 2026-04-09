import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Wall Calender",
  description: "Wall Calender with multiple features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
