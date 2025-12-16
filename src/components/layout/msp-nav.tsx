"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Users,
  BarChart3,
  Settings,
  KanbanSquare,
  GanttChart,
  Network,
  CheckSquare,
} from "lucide-react";

const mspNavigation = [
  {
    name: "Dashboard",
    href: "/msp/dashboard",
    icon: LayoutDashboard,
    description: "Client portfolio overview"
  },
  {
    name: "Clients",
    href: "/msp/clients",
    icon: Building2,
    description: "Manage client organizations"
  },
  {
    name: "Projects",
    href: "/msp/projects",
    icon: FolderKanban,
    description: "Client compliance projects",
    children: [
      { name: "All Projects", href: "/msp/projects", icon: FolderKanban },
      { name: "Kanban Board", href: "/msp/projects/kanban", icon: KanbanSquare },
      { name: "GANTT Chart", href: "/msp/projects/gantt", icon: GanttChart },
      { name: "RACI Matrix", href: "/msp/projects/raci", icon: Network },
    ],
  },
  {
    name: "Tasks",
    href: "/msp/tasks",
    icon: CheckSquare,
    description: "Cross-client task management"
  },
  {
    name: "Team",
    href: "/msp/team",
    icon: Users,
    description: "MSP staff & workload"
  },
  {
    name: "Reports",
    href: "/msp/reports",
    icon: BarChart3,
    description: "Analytics & insights"
  },
  {
    name: "Settings",
    href: "/msp/settings",
    icon: Settings,
    description: "MSP configuration"
  },
];

export function MspNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {mspNavigation.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const hasChildren = item.children && item.children.length > 0;

        return (
          <div key={item.name}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              <div className="flex-1">
                <div>{item.name}</div>
                {item.description && !isActive && (
                  <div className="text-xs text-slate-400">{item.description}</div>
                )}
              </div>
            </Link>

            {/* Sub-navigation for Projects */}
            {hasChildren && isActive && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children?.map((child) => {
                  const isChildActive = pathname === child.href;
                  return (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors",
                        isChildActive
                          ? "bg-blue-100 text-blue-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                      )}
                    >
                      <child.icon className="h-4 w-4" />
                      {child.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
