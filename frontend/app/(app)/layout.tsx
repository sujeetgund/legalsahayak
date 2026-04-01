import { AppHeader } from "@/components/layout/app-header";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
