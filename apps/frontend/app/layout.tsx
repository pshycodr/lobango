import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lobango | Multi Cuisine Restaurant",
  description:
    "Experience exquisite flavors, authentic tastes, and warm memories at Lobango.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
