import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForumPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Community Forum</h1>
        <p className="text-muted-foreground mt-2">
          Connect with others and discuss legal topics
        </p>
      </div>

      <Card className="border-border shadow-light">
        <CardHeader>
          <CardTitle>Forum Coming Soon</CardTitle>
          <CardDescription>
            Our community forum is being prepared. Check back soon!
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
