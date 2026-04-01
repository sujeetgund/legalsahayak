import type { Metadata } from "next";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";
import { Poppins, Bricolage_Grotesque } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";

export const metadata: Metadata = {
  title: "LegalSahayak",
  description: "AI-Powered Legal Assistance and Community Forum",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-bricolage-grotesque",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "font-body antialiased min-h-screen bg-background",
          poppins.variable,
          bricolageGrotesque.variable,
        )}
      >
        <ClerkProvider
          dynamic
          appearance={{ theme: shadcn }}
          signInUrl="/signin"
          signUpUrl="/signup"
        >
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
