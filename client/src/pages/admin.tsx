import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users, DollarSign, BookOpen, HelpCircle, ArrowLeft,
  CheckCircle, XCircle, Shield, TrendingUp
} from "lucide-react";

type AdminUser = {
  id: number;
  email: string;
  name: string;
  hasPaid: boolean;
  isAdmin: boolean;
  createdAt: string | null;
};

type AdminStats = {
  totalUsers: number;
  paidUsers: number;
  totalRevenue: number;
  totalQuizzes: number;
  avgScore: number;
  totalChaptersCompleted: number;
};

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const { data: users = [], isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  const loading = usersLoading || statsLoading;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28" />)}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const nonAdminUsers = users.filter(u => !u.isAdmin);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">NIS2 Prep Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              App
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logga ut
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats?.totalUsers ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Totala användare</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.paidUsers ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Betalande</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.totalRevenue ?? 0} kr</p>
                  <p className="text-sm text-muted-foreground">Intäkter</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.totalQuizzes ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Quiz genomförda</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional stats row */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats?.totalChaptersCompleted ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Kapitel avklarade (alla)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.avgScore ?? 0}%</p>
                  <p className="text-sm text-muted-foreground">Snittresultat quiz</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Registrerade användare ({nonAdminUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nonAdminUsers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Inga användare registrerade ännu.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-muted-foreground">ID</th>
                      <th className="pb-3 font-medium text-muted-foreground">Namn</th>
                      <th className="pb-3 font-medium text-muted-foreground">E-post</th>
                      <th className="pb-3 font-medium text-muted-foreground">Betalning</th>
                      <th className="pb-3 font-medium text-muted-foreground">Registrerad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nonAdminUsers.map(u => (
                      <tr key={u.id} className="border-b last:border-0">
                        <td className="py-3 text-muted-foreground">#{u.id}</td>
                        <td className="py-3 font-medium">{u.name}</td>
                        <td className="py-3">{u.email}</td>
                        <td className="py-3">
                          {u.hasPaid ? (
                            <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Betald
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="h-3 w-3 mr-1" />
                              Obetald
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString("sv-SE")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
