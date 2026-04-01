import { LanguageToggle } from "@/components/language-toggle";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  if (userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen w-full bg-background relative">
      <div className="absolute right-4 top-4 z-20">
        <LanguageToggle compact />
      </div>
      {children}
    </div>
  );
}
