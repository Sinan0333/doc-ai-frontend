import { NavLink, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  ArrowLeftRight,
  BarChart3,
  ClipboardList,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  Upload,
  User,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { doctorService } from "@/services/doctor.service";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface SidebarProps {
  role: "patient" | "doctor" | "admin";
}

interface SidebarLink {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: number | string | null;
}

const Sidebar = ({ role }: SidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { data: pendingCount = 0 } = useQuery({
    queryKey: ["pendingReviewCount"],
    queryFn: () => doctorService.getPendingReviewCount(),
    enabled: role === "doctor",
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleLogout = () => {
    logout();
    if (role === "patient") navigate("/patient/login");
    else if (role === "doctor") navigate("/doctor/login");
    else navigate("/admin/login");
  };

  const patientLinks: SidebarLink[] = [
    { to: "/patient/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/patient/upload", icon: Upload, label: "Upload Report" },
    { to: "/patient/history", icon: History, label: "History" },
    { to: "/patient/comparison", icon: ArrowLeftRight, label: "Report Comparison" },
    { to: "/patient/profile", icon: User, label: "Profile" },
  ];

  const doctorLinks: SidebarLink[] = [
    { to: "/doctor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/doctor/patients", icon: Users, label: "Patient List" },
    { to: "/doctor/review-requests", icon: ClipboardList, label: "Review Requests", badge: pendingCount > 0 ? pendingCount : null },
    // { to: "/doctor/analytics", icon: BarChart3, label: "Analytics" },
    // { to: "/doctor/alerts", icon: AlertCircle, label: "Alerts" },
  ];

  const adminLinks: SidebarLink[] = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/doctors", icon: Users, label: "Doctor List" },
    { to: "/admin/patients", icon: Users, label: "Patient List" },
    { to: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  const links = role === "patient" ? patientLinks : role === "doctor" ? doctorLinks : adminLinks;

  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">DocAI</h1>
            <p className="text-xs text-muted-foreground capitalize">{role} Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="h-5 w-5" />
                <span className="font-medium flex-1">{link.label}</span>
                {link.badge !== undefined && link.badge !== null && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                      isActive
                        ? "bg-destructive text-destructive-foreground shadow-sm"
                        : "bg-destructive/10 text-destructive group-hover:bg-destructive/20"
                    )}
                  >
                    {link.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-colors hover:bg-destructive hover:text-destructive-foreground text-muted-foreground"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
