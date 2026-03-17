import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Shield, LayoutDashboard, BookOpen, HelpCircle, Award, Moon, Sun, LogOut, ShieldCheck } from "lucide-react";


export function AppSidebar() {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/study", label: "Kursmaterial", icon: BookOpen },
    { path: "/quiz", label: "Quiz", icon: HelpCircle },
    { path: "/certificate", label: "Certifikat", icon: Award },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-sm">NIS2 Prep</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={location === item.path}
                    onClick={() => navigate(item.path)}
                    data-testid={`sidebar-nav-${item.label.toLowerCase()}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user?.isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location === "/admin"}
                    onClick={() => navigate("/admin")}
                    data-testid="sidebar-nav-admin"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Admin</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <div className="px-2 py-1 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={toggleTheme}
            data-testid="sidebar-theme-toggle"
          >
            {theme === "dark" ? (
              <><Sun className="mr-2 h-4 w-4" /> Ljust läge</>
            ) : (
              <><Moon className="mr-2 h-4 w-4" /> Mörkt läge</>
            )}
          </Button>
          {user && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground truncate">{user.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleLogout}
                data-testid="sidebar-logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
