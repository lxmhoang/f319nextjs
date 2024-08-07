import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "./lib/context";
import { Flowbite, ThemeModeScript } from "flowbite-react"; 
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "F319",
  description: "Cùng nhau thành công",
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
      <body className="{inter.className} min-h-screen h-full" >
        <Flowbite  theme={{ mode: 'dark' }}>
          <AppWrapper>
              {children}
          </AppWrapper>
        </Flowbite>
      </body>
    </html>
  );
}