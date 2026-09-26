import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context";
import { DemoPersonaBanner } from "@/components/common/DemoPersonaBanner";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "Resolve AI — AI Complaint Investigation & Resolution Platform",
  description: "Every Complaint. Any Domain. One Intelligent Resolution Platform. Companies manage less. We investigate, route and resolve more — at lower operational cost.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-teal-600 selection:text-white">
        <AuthProvider>
          <DemoPersonaBanner />
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
