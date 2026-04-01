import { SignIn } from "@clerk/nextjs";

export default function SigninPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <SignIn
        path="/signin"
        routing="path"
        signUpUrl="/signup"
        fallbackRedirectUrl="/"
      />
    </div>
  );
}
