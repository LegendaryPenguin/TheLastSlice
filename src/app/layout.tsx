import type { Metadata } from "next";
import "./globals.css";
import { Press_Start_2P } from "next/font/google";
import PrivyProviderWrapper from "@/components/PrivyProviderWrapper";
import GuestAccountCreator from "@/components/GuestAccountCreator";

const press = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "Pizza Raid",
  description: "Realtime multiplayer boss raid",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={press.className}>
        
        <PrivyProviderWrapper>
          <GuestAccountCreator />
          {children}
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}
