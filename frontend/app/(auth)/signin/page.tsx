"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authUtils } from "@/lib/auth";
import { toast } from "sonner";
import { Scale } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

const signinSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export default function SigninPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SigninFormValues) {
    setIsLoading(true);
    try {
      const user = authUtils.signin(values.email, values.password);

      if (user) {
        toast.success(`Welcome back, ${user.fullName}!`);
        // Redirect to dashboard/assistant page
        router.push("/");
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (error) {
      toast.error("An error occurred.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header with logo/branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Scale className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">
              LegalSahayak
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("auth", "tagline")}
          </p>
        </div>

        <Card className="border-border shadow-light">
          <CardHeader className="space-y-2">
            <CardTitle className="font-headline">
              {t("auth", "welcomeBack")}
            </CardTitle>
            <CardDescription>{t("auth", "signinDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth", "email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth", "password")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      disabled={isLoading}
                    />
                    <span className="text-muted-foreground">
                      {t("auth", "rememberMe")}
                    </span>
                  </label>
                  <Link
                    href="#"
                    className="text-primary hover:underline font-medium"
                  >
                    {t("auth", "forgotPassword")}
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? t("auth", "signingIn") : t("auth", "signIn")}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                {t("auth", "noAccount")}{" "}
              </span>
              <Link
                href="/signup"
                className="text-primary font-medium hover:underline"
              >
                {t("auth", "signUp")}
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            {t("auth", "bySignin")}{" "}
            <Link href="#" className="underline hover:text-foreground">
              {t("common", "termsOfService")}
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-foreground">
              {t("common", "privacyPolicy")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
