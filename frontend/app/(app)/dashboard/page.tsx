import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Your Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your legal matters and activities
        </p>
      </div>

      <Card className="border-border shadow-light">
        <CardHeader>
          <CardTitle>Dashboard Coming Soon</CardTitle>
          <CardDescription>
            Your personalized dashboard is being prepared.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a protected route that only authenticated users can access.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
