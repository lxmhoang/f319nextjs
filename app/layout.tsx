import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNav from "./ui/topnav";
import { AppWrapper } from "./lib/context";
import { AuthProvider } from "./components/auth-provider";
import BottomNav from "./ui/botnav";
import { DarkThemeToggle, Flowbite, Sidebar, ThemeModeScript } from "flowbite-react";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import SideBar from "./ui/sidebar";
import StatsCard from "./ui/statsCard";
import type { CustomFlowbiteTheme } from "flowbite-react";
import TopBar from "./ui/topbar";
import { useState } from "react";

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
    <html lang="en">
      <head>
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