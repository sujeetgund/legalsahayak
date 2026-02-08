"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/use-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Download,
  Trash2,
  MessageSquare,
  Scale,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { educationLevels, occupations, indianStates } from "@/lib/data";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user, updateUserInfo, updateProfile, deleteAccount, exportData } =
    useAuth();
  const router = useRouter();

  // Basic info form state
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isUpdatingBasic, setIsUpdatingBasic] = useState(false);

  // Profile form state
  const [age, setAge] = useState(user?.profile?.age?.toString() || "");
  const [gender, setGender] = useState(user?.profile?.gender || "");
  const [location, setLocation] = useState(user?.profile?.location || "");
  const [educationLevel, setEducationLevel] = useState(
    user?.profile?.education_level || "",
  );
  const [jobTitle, setJobTitle] = useState(user?.profile?.job_title || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const handleUpdateBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingBasic(true);

    try {
      const success = updateUserInfo(fullName, email);
      if (success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile. Email might be already taken.");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile.");
    } finally {
      setIsUpdatingBasic(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const success = updateProfile({
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
        location: location || undefined,
        education_level: educationLevel || undefined,
        job_title: jobTitle || undefined,
      });

      if (success) {
        toast.success("Additional details updated successfully!");
      } else {
        toast.error("Failed to update details.");
      }
    } catch (error) {
      toast.error("An error occurred while updating details.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleDownloadData = () => {
    const data = exportData();
    if (data) {
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `legalsahayak-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Your data has been downloaded!");
    } else {
      toast.error("Failed to export data.");
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (confirmed) {
      const secondConfirm = window.confirm(
        "This will permanently delete all your data. Are you absolutely sure?",
      );

      if (secondConfirm) {
        const success = deleteAccount();
        if (success) {
          toast.success("Account deleted successfully.");
          router.push("/");
        } else {
          toast.error("Failed to delete account.");
        }
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const quickActions = [
    {
      icon: MessageSquare,
      title: "Ask AI Assistant",
      description: "Get instant legal guidance",
      href: "/assistant",
      color: "text-blue-600",
    },
    {
      icon: Scale,
      title: "Community Forum",
      description: "Connect with others",
      href: "/forum",
      color: "text-purple-600",
    },
    {
      icon: BookOpen,
      title: "Legal Resources",
      description: "Browse legal library",
      href: "/legal-library",
      color: "text-green-600",
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Your Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile and access legal tools
        </p>
      </div>

      {/* Profile Overview */}
      <Card className="border-border shadow-light">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" alt={user.fullName} />
              <AvatarFallback className="text-2xl">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user.fullName}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => (
          <Card
            key={action.title}
            className="border-border shadow-light cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(action.href)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div
                  className={`rounded-lg p-3 bg-muted ${action.color} flex items-center justify-center`}
                >
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Management Tabs */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="profile">Additional Details</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic">
          <Card className="border-border shadow-light">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your name and email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateBasicInfo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <Button type="submit" disabled={isUpdatingBasic}>
                  {isUpdatingBasic ? "Updating..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional Details Tab */}
        <TabsContent value="profile">
          <Card className="border-border shadow-light">
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>
                Help us personalize your experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Enter your age"
                      min="18"
                      max="120"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location (State)</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Education Level</Label>
                  <Select
                    value={educationLevel}
                    onValueChange={setEducationLevel}
                  >
                    <SelectTrigger id="education">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Select value={jobTitle} onValueChange={setJobTitle}>
                    <SelectTrigger id="occupation">
                      <SelectValue placeholder="Select occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      {occupations.map((occupation) => (
                        <SelectItem
                          key={occupation}
                          value={occupation.toLowerCase().replace(/\s+/g, "_")}
                        >
                          {occupation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? "Updating..." : "Save Details"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Settings Tab */}
        <TabsContent value="account">
          <div className="space-y-4">
            {/* Download Data Card */}
            <Card className="border-border shadow-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Your Data
                </CardTitle>
                <CardDescription>
                  Export all your data in JSON format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Download a copy of your profile information, preferences, and
                  activity data.
                </p>
                <Button onClick={handleDownloadData} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Data
                </Button>
              </CardContent>
            </Card>

            {/* Delete Account Card */}
            <Card className="border-destructive shadow-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Permanently delete your account and all data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please
                  be certain. This action will:
                </p>
                <ul className="text-sm text-muted-foreground mb-4 list-disc list-inside space-y-1">
                  <li>Delete your profile and all personal information</li>
                  <li>Remove all your saved conversations</li>
                  <li>Cancel any active subscriptions</li>
                  <li>Cannot be undone</li>
                </ul>
                <Button
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
