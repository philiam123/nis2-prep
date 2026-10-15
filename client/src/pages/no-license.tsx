import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Building2, Mail } from "lucide-react";
import { QUOTE_MAILTO } from "@/lib/quote";

export default function NoLicensePage() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">NIS2 Utbildning</span>
        </div>
        <Card>
          <CardHeader className="text-center">
            <Building2 className="h-10 w-10 mx-auto text-primary mb-2" />
            <CardTitle>Ditt konto saknar licens</CardTitle>
            <CardDescription>
              NIS2-utbildningen säljs som företagslicens. Be din arbetsgivare om en företagskod,
              eller begär en offert för din organisation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {user && <p className="text-sm text-center text-muted-foreground">Inloggad som {user.email}</p>}
            <Button asChild className="w-full" data-testid="request-quote">
              <a href={QUOTE_MAILTO}>
                <Mail className="mr-2 h-4 w-4" /> Begär offert
              </a>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => { await logout(); navigate("/register"); }}
            >
              Registrera med företagskod
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
