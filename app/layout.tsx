import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNav from "./ui/topnav";
import { getAuthenticatedAppForUser } from "./lib/firebase/firebase";
import Breadcrumbs from "./ui/breadcrumbs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tư vấn ck",
  description: "Tư vấn chứng khoán ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { currentUser } = await getAuthenticatedAppForUser();
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopNav initialUser={currentUser?.toJSON()} />
        
        {children}</body>
    </html>
  );
}
