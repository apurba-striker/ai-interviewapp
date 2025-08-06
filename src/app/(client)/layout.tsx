"use client";

import "../globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import SideMenu from "@/components/sideMenu";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>FoloUp - AI-powered Interviews</title>
        <meta name="description" content="AI-powered Interviews" />
        <link rel="icon" href="/browser-client-icon.ico" />
      </head>
      <body
        className={cn(
          inter.className,
          "antialiased overflow-hidden min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200",
        )}
      >
        <ClerkProvider>
          <Providers>
            {!pathname.includes("/sign-in") &&
              !pathname.includes("/sign-up") && <Navbar />}
            <div className="flex flex-row h-screen">
              {!pathname.includes("/sign-in") &&
                !pathname.includes("/sign-up") && <SideMenu />}
              <div className="ml-64 pt-16 h-full overflow-y-auto flex-grow transition-all duration-300">
                {children}
              </div>
            </div>
            <Toaster
              toastOptions={{
                classNames: {
                  toast: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                  title: "text-gray-900 dark:text-gray-100",
                  description: "text-gray-600 dark:text-gray-400",
                  actionButton: "bg-indigo-600 hover:bg-indigo-700",
                  cancelButton: "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100",
                  closeButton: "text-gray-400 dark:text-gray-500",
                },
              }}
            />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
