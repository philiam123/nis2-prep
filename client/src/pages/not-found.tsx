import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function NotFound() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background text-center">
      <Shield className="h-12 w-12 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold mb-2">Sidan hittades inte</h1>
      <p className="text-muted-foreground mb-6">Sidan du letar efter finns inte.</p>
      <Button onClick={() => navigate("/")}>Gå till startsidan</Button>
    </div>
  );
}
