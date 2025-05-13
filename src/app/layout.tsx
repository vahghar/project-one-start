import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "CommitSense - AI-Powered GitHub Analytics",
  description: "Transform your GitHub workflow with AI-driven commit analysis, security insights, and team collaboration tools.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    images: [{ url: "/og-image.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <ToastContainer
            position="bottom-right" theme="dark" autoClose={3000}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
