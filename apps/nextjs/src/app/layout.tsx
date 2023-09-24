import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { auth } from "@acme/auth";

//import { authOptions } from "../app/api/auth/[...nextauth]/route"

import "~/styles/globals.css";

import { headers } from "next/headers";

import { NextAuthSessionProvider, TRPCReactProvider } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Create T3 Turbo",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Create T3 Turbo",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
};

export default async function Layout(props: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <NextAuthSessionProvider session={session}>
          <TRPCReactProvider headers={headers()}>
            {props.children}
          </TRPCReactProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
