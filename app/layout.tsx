import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNav from "./ui/topnav";
import { AppWrapper } from "./lib/context";
import { AuthProvider } from "./components/auth-provider";

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

  console.log("layout refresh")
  return (
    <html lang="en">
      <body className="{inter.className} dark">

        <AppWrapper>

            <TopNav></TopNav>
            {children}
        </AppWrapper>


      </body>
    </html>
  );
}
