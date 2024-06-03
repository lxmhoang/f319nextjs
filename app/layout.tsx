import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "./lib/context";
import { Flowbite, ThemeModeScript } from "flowbite-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tư vấn ck",
  description: "Tư vấn chứng khoán ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <link rel="shortcut icon" href="/images/favicon.ico" />
        <ThemeModeScript />
      </head>
      <body className="{inter.className} h-full" >
        <Flowbite>
          <AppWrapper>
            {children}
          </AppWrapper>
        </Flowbite>
      </body>
    </html>
  );
}