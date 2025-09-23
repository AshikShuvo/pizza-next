import type { Metadata } from "next";
import { ringsideCompressed, ringsideNarrow } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peppes Next",
  description: "Peppes Next.js application with responsive design",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ringsideCompressed.variable} ${ringsideNarrow.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
