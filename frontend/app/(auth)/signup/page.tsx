import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <SignUp
        path="/signup"
        routing="path"
        signInUrl="/signin"
        fallbackRedirectUrl="/onboarding"
      />
    </div>
  );
}
