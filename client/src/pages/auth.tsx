import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2 } from "lucide-react";

function LoginPage() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.isAdmin) {
        navigate("/admin");
      } else if (user.hasPaid) {
        navigate("/dashboard");
      } else {
        navigate("/payment");
      }
    } catch (err: any) {
      setError(err.message || "Inloggning misslyckades");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">NIS2 Prep</span>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Välkommen tillbaka</CardTitle>
            <CardDescription>Logga in på ditt konto</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">E-post</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="din@email.se"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="login-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Lösenord</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="login-password"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive" data-testid="login-error">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading} data-testid="login-submit">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Logga in
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Har du inget konto?{" "}
              <button
                className="text-primary hover:underline"
                onClick={() => navigate("/register")}
                data-testid="login-register-link"
              >
                Registrera dig
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RegisterPage() {
  const [, navigate] = useLocation();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password, name);
      navigate("/payment");
    } catch (err: any) {
      setError(err.message || "Registrering misslyckades");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">NIS2 Prep</span>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Skapa konto</CardTitle>
            <CardDescription>Starta din NIS2-utbildning</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Fullständigt namn</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Anna Andersson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  data-testid="register-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">E-post</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="din@email.se"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="register-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Lösenord</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Minst 6 tecken"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  data-testid="register-password"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive" data-testid="register-error">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading} data-testid="register-submit">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Skapa konto
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Har du redan ett konto?{" "}
              <button
                className="text-primary hover:underline"
                onClick={() => navigate("/login")}
                data-testid="register-login-link"
              >
                Logga in
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { LoginPage, RegisterPage };
