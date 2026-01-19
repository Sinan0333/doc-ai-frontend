import { NavLink, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  BarChart3,
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

interface SidebarProps {
  role: "patient" | "doctor";
}

const Sidebar = ({ role }: SidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(role === "patient" ? "/patient/login" : "/doctor/login");
  };

  const patientLinks = [
    { to: "/patient/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/patient/upload", icon: Upload, label: "Upload Report" },
    { to: "/patient/history", icon: History, label: "History" },
    { to: "/patient/profile", icon: User, label: "Profile" },
  ];

  const doctorLinks = [
    { to: "/doctor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/doctor/patients", icon: Users, label: "Patient List" },
    { to: "/doctor/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/doctor/alerts", icon: AlertCircle, label: "Alerts" },
  ];

  const links = role === "patient" ? patientLinks : doctorLinks;

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
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              )
            }
          >
            <link.icon className="h-5 w-5" />
            <span className="font-medium">{link.label}</span>
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
