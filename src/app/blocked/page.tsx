import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";

export default function UserBlocked() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
            <Ban className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            Account Blocked
          </CardTitle>
          <CardDescription className="text-center">
            We're sorry, but your account has been blocked.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            This may be due to a violation of our terms of service or suspicious
            activity detected on your account. If you believe this is an error,
            please contact our support team for assistance.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline">Contact Support</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
