import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Loader2, Shield, BookOpen, HelpCircle, Award, CreditCard } from "lucide-react";

export default function PaymentPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePurchase = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/payment/create-checkout");
      const data = await res.json();
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError("Kunde inte skapa betalningssession. Försök igen.");
      }
    } catch (err: any) {
      setError(err.message || "Betalning misslyckades. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">NIS2 Utbildning</span>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Slutför ditt köp</CardTitle>
            <CardDescription>Få tillgång till hela NIS2-utbildningen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {[
                { icon: BookOpen, text: "11 utbildningsavsnitt anpassade för energisektorn" },
                { icon: HelpCircle, text: "100+ quizfrågor med detaljerade förklaringar" },
                { icon: Award, text: "Slutprov med personligt kurscertifikat" },
                { icon: Shield, text: "Uppfyller Cybersäkerhetslagens utbildningskrav" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-muted-foreground">NIS2 Cybersäkerhetsutbildning</span>
                <span className="text-2xl font-bold">1 490 kr</span>
              </div>
              <p className="text-xs text-muted-foreground">Engångsbetalning. Obegränsad tillgång.</p>
            </div>

            {error && (
              <p className="text-sm text-destructive" data-testid="payment-error">{error}</p>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handlePurchase}
              disabled={loading}
              data-testid="payment-submit"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Omdirigerar till betalning...</>
              ) : (
                <><CreditCard className="mr-2 h-4 w-4" /> Betala med Stripe</>
              )}
            </Button>

            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>Powered by Stripe</span>
              <span>•</span>
              <span>Säker betalning</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
