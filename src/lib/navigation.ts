import type { ComponentType } from "react";
import {
  BarChart3,
  ShieldCheck,
  Users,
  ClipboardList,
  ListChecks,
  ScrollText,
  Settings,
  LayoutDashboard,
  UserCircle2,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  permission: string;
  icon: ComponentType<{ className?: string }>;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", permission: "dashboard.view", icon: LayoutDashboard },
  { label: "Users", href: "/users", permission: "users.view", icon: Users },
  { label: "Permissions", href: "/permissions", permission: "permissions.view", icon: ShieldCheck },
  { label: "Leads", href: "/leads", permission: "leads.view", icon: ClipboardList },
  { label: "Tasks", href: "/tasks", permission: "tasks.view", icon: ListChecks },
  { label: "Reports", href: "/reports", permission: "reports.view", icon: BarChart3 },
  { label: "Audit Logs", href: "/audit-logs", permission: "audit.view", icon: ScrollText },
  { label: "Customer Portal", href: "/customer-portal", permission: "customer.portal.view", icon: UserCircle2 },
  { label: "Settings", href: "/settings", permission: "settings.view", icon: Settings },
];
