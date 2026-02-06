"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Scale, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { educationLevels, indianStates, occupations } from "@/lib/data";
import { authUtils } from "@/lib/auth";
import { toast } from "sonner";

const profileFormSchema = z.object({
  age: z.coerce
    .number()
    .int()
    .positive()
    .min(18, { message: "Must be at least 18 years old." })
    .max(120, { message: "Please enter a valid age." }),
  gender: z.string().min(1, { message: "Please select your gender." }),
  location: z.string().min(1, { message: "Please select your location." }),
  education_level: z
    .string()
    .min(1, { message: "Please select your education level." }),
  job_title: z.string().min(1, { message: "Please tell us your occupation." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function OnboardingPage() {
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      age: 18,
      gender: "",
      location: "",
      education_level: "",
      job_title: "",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    // Save onboarding details to user profile
    const success = authUtils.updateUserProfile({
      age: data.age,
      gender: data.gender,
      location: data.location.toLowerCase(),
      education_level: data.education_level,
      job_title: data.job_title.toLowerCase(),
    });

    if (success) {
      toast.success("Profile updated successfully!");
      router.push("/assistant");
    } else {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B365D] via-[#234170] to-[#1B365D] p-4 lg:p-8 relative overflow-hidden">
      {/* Animated background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFB800]/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFB800]/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          {/* Left Side - Branding & Info */}
          <div className="lg:w-96 flex-shrink-0 text-white">
            <div className="sticky top-8">
              {/* Logo Area */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-[#FFB800] rounded-xl shadow-lg">
                    <Scale className="w-8 h-8 text-[#1B365D]" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      LegalSahayak
                    </h1>
                    <p className="text-sm text-white/70">
                      Your Legal Companion
                    </p>
                  </div>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-white">
                    Welcome! Let's Get Started
                  </h2>
                  <p className="text-white/80 leading-relaxed">
                    Help us understand you better so we can provide personalized
                    legal guidance tailored to your needs.
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#FFB800]/20 rounded-lg flex items-center justify-center mt-0.5">
                      <Sparkles className="w-4 h-4 text-[#FFB800]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        AI-Powered Guidance
                      </h3>
                      <p className="text-sm text-white/70">
                        Get instant legal advice powered by advanced AI
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#FFB800]/20 rounded-lg flex items-center justify-center mt-0.5">
                      <Users className="w-4 h-4 text-[#FFB800]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        For Everyone
                      </h3>
                      <p className="text-sm text-white/70">
                        Accessible legal help for all Indians
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#FFB800]/20 rounded-lg flex items-center justify-center mt-0.5">
                      <Scale className="w-4 h-4 text-[#FFB800]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        Know Your Rights
                      </h3>
                      <p className="text-sm text-white/70">
                        Understand and exercise your legal rights
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Note */}
              <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <p className="text-xs text-white/80 leading-relaxed">
                  <span className="font-semibold text-[#FFB800]">
                    Privacy First:
                  </span>{" "}
                  Your information is secure and will only be used to
                  personalize your experience. We never share your data.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1">
            <Card className="shadow-2xl border-none bg-white/95 backdrop-blur-md overflow-hidden">
              <CardHeader className="p-6 lg:p-8 bg-gradient-to-r from-white to-[#FFB800]/5 border-b">
                <CardTitle className="text-2xl lg:text-3xl text-[#1B365D]">
                  Tell Us About Yourself
                </CardTitle>
                <CardDescription className="text-base">
                  This helps us provide relevant legal information for your
                  situation
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 lg:p-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Age and Gender Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-[#1B365D]">
                              Age <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter your age"
                                className="h-11 border-gray-300 focus:border-[#FFB800] focus:ring-[#FFB800]"
                                {...field}
                                onChange={(event) =>
                                  field.onChange(
                                    event.target.value
                                      ? +event.target.value
                                      : undefined,
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-[#1B365D]">
                              Gender <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 border-gray-300 focus:border-[#FFB800] focus:ring-[#FFB800]">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer_not_to_say">
                                  Prefer not to say
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Location */}
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-[#1B365D]">
                            State/Region <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 border-gray-300 focus:border-[#FFB800] focus:ring-[#FFB800]">
                                <SelectValue placeholder="Select your state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {indianStates.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Education Level */}
                    <FormField
                      control={form.control}
                      name="education_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-[#1B365D]">
                            Education Level{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 border-gray-300 focus:border-[#FFB800] focus:ring-[#FFB800]">
                                <SelectValue placeholder="Select education level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {educationLevels.map((level) => (
                                <SelectItem
                                  key={level.value}
                                  value={level.value}
                                >
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Job Title */}
                    <FormField
                      control={form.control}
                      name="job_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-[#1B365D]">
                            Occupation <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 border-gray-300 focus:border-[#FFB800] focus:ring-[#FFB800]">
                                <SelectValue placeholder="Select your occupation" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {occupations.map((occupation) => (
                                <SelectItem key={occupation} value={occupation}>
                                  {occupation}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#FFB800] to-[#FF8F00] hover:from-[#FF8F00] hover:to-[#FFB800] text-[#1B365D] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                      >
                        Continue to LegalSahayak
                        <Sparkles className="w-5 h-5 ml-2" />
                      </Button>
                    </div>

                    <p className="text-xs text-gray-500 text-center pt-2">
                      By continuing, you agree to our Terms of Service and
                      Privacy Policy
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
