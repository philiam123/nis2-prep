import { Switch, Route, Router, Redirect } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import LandingPage from "@/pages/landing";
import { LoginPage, RegisterPage } from "@/pages/auth";
import PaymentPage from "@/pages/payment";
import PaymentSuccessPage from "@/pages/payment-success";
import DashboardPage from "@/pages/dashboard";
import StudyPage from "@/pages/study";
import QuizPage from "@/pages/quiz";
import ExamPage from "@/pages/exam";
import CertificatePage from "@/pages/certificate";
import NotFound from "@/pages/not-found";
import AdminPage from "@/pages/admin";
import VerifyPage from "@/pages/verify";
import PrivacyPage from "@/pages/privacy";
import CookiesPage from "@/pages/cookies";
import ProfilePage from "@/pages/profile";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 w-64">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mx-auto" />
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <Redirect to="/login" />;
  if (!user.hasPaid) return <Redirect to="/payment" />;

  return <>{children}</>;
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <Redirect to="/login" />;

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <Redirect to="/login" />;
  if (!user.isAdmin) return <Redirect to="/dashboard" />;

  return <>{children}</>;
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center border-b px-4">
          <SidebarTrigger className="md:hidden" />
          <span className="font-semibold text-sm flex-1 text-center">NIS2 Kurs</span>
        </header>
        <div className="flex-1 overflow-auto min-w-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/payment">
        <AuthGate>
          <PaymentPage />
        </AuthGate>
      </Route>
      <Route path="/payment-success">
        <AuthGate>
          <PaymentSuccessPage />
        </AuthGate>
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <DashboardPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/study">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <StudyPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/quiz">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <QuizPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/exam">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <ExamPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/certificate">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <CertificatePage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <ProfilePage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <AdminRoute>
          <AdminPage />
        </AdminRoute>
      </Route>
      <Route path="/verify/:certId" component={VerifyPage} />
      <Route path="/verify" component={VerifyPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/cookies" component={CookiesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router hook={useHashLocation}>
              <AppRouter />
            </Router>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
