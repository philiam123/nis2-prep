import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Loader2, AlertCircle } from "lucide-react";

function getSessionSearchParams(): URLSearchParams {
  if (window.location.search) {
    return new URLSearchParams(window.location.search);
  }
  const hash = window.location.hash;
  const qIndex = hash.indexOf("?");
  if (qIndex !== -1) {
    return new URLSearchParams(hash.substring(qIndex));
  }
  return new URLSearchParams();
}

export default function PaymentSuccessPage() {
  const [, navigate] = useLocation();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const params = getSessionSearchParams();
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setStatus("error");
      setErrorMsg("Ingen betalningssession hittades.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await apiRequest("POST", "/api/payment/verify", { sessionId });
        const data = await res.json();

        if (data.success) {
          await refreshUser();
          setStatus("success");
          setTimeout(() => navigate("/dashboard"), 3000);
        } else {
          setStatus("error");
          setErrorMsg("Betalningsverifiering misslyckades. Kontakta support.");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(err.message || "Kunde inte verifiera betalning. Kontakta support.");
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">NIS2 Utbildning</span>
        </div>

        <Card>
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            {status === "verifying" && (
              <>
                <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                <h2 className="text-xl font-semibold">Verifierar betalning...</h2>
                <p className="text-sm text-muted-foreground">Vänta medan vi bekräftar ditt köp.</p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h2 className="text-xl font-semibold">Betalning genomförd!</h2>
                <p className="text-sm text-muted-foreground">
                  Välkommen till NIS2 Utbildning. Du har nu tillgång till hela utbildningen.
                </p>
                <Button onClick={() => navigate("/dashboard")} className="mt-4">
                  Gå till dashboard
                </Button>
                <p className="text-xs text-muted-foreground">Omdirigerar automatiskt om 3 sekunder...</p>
              </>
            )}

            {status === "error" && (
              <>
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <h2 className="text-xl font-semibold">Något gick fel</h2>
                <p className="text-sm text-muted-foreground">{errorMsg}</p>
                <div className="flex gap-2 justify-center mt-4">
                  <Button variant="outline" onClick={() => navigate("/payment")}>
                    Försök igen
                  </Button>
                  <Button onClick={() => navigate("/dashboard")}>
                    Gå till dashboard
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
