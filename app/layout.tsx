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
          {/* <div className="flex flex-col items-center h-screen w-screen bg-slate-800 pt-40 p-4"> */}
            {/* <div> */}

            <TopNav></TopNav>
            {/* <NavBar></NavBar> */}
            {/* </div> */}
            {children}
          {/* </div> */}
        </AppWrapper>


      </body>
    </html>
  );
}
