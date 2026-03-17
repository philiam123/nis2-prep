import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Lock, Mail, Loader2, CheckCircle } from "lucide-react";

function parseErrorMessage(err: any, fallback: string): string {
  if (!err?.message) return fallback;
  const match = err.message.match(/^\d+:\s*(.+)/);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed.message) return parsed.message;
    } catch {
      return match[1];
    }
  }
  return err.message || fallback;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    if (newPassword !== confirmPassword) {
      toast({
        title: "Fel",
        description: "Nya lösenorden matchar inte.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Fel",
        description: "Nytt lösenord måste vara minst 6 tecken.",
        variant: "destructive",
      });
      return;
    }

    setPasswordSaving(true);
    try {
      await apiRequest("PATCH", "/api/auth/profile", {
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Lösenord uppdaterat",
        description: "Ditt lösenord har ändrats.",
      });
    } catch (err: any) {
      toast({ title: "Fel", description: parseErrorMessage(err, "Kunde inte uppdatera lösenord"), variant: "destructive" });
    } finally {
      setPasswordSaving(false);
    }
  };

  const registeredDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Min profil</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Hantera ditt konto och lösenord
        </p>
      </div>

      {/* Account info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Kontoinformation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-1">
            <Label className="text-xs text-muted-foreground">Namn</Label>
            <p className="text-sm font-medium" data-testid="profile-name">
              {user?.name}
            </p>
          </div>
          <div className="grid gap-1">
            <Label className="text-xs text-muted-foreground">E-post</Label>
            <p className="text-sm font-medium" data-testid="profile-email">
              {user?.email}
            </p>
          </div>
          {registeredDate && (
            <div className="grid gap-1">
              <Label className="text-xs text-muted-foreground">Registrerad</Label>
              <p className="text-sm" data-testid="profile-registered">
                {registeredDate}
              </p>
            </div>
          )}
          {user?.isAdmin && (
            <div className="flex items-center gap-1.5 mt-1">
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Administratör</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password change */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            Ändra lösenord
          </CardTitle>
          <CardDescription className="text-xs">
            Ange ditt nuvarande lösenord för verifiering.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Nuvarande lösenord</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                data-testid="input-current-password"
              />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Nytt lösenord</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minst 6 tecken"
                data-testid="input-new-password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Bekräfta nytt lösenord</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Upprepa nytt lösenord"
                data-testid="input-confirm-password"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
              data-testid="button-save-password"
            >
              {passwordSaving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sparar...</>
              ) : (
                <><Lock className="mr-2 h-4 w-4" /> Uppdatera lösenord</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
