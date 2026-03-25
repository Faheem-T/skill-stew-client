import { LayoutDashboardIcon, ShieldCheck, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { RoutePath } from "@/shared/config/routes";
import { APP_NAME } from "@/shared/config/constants";
import { ThemeToggle } from "@/shared/components/theme/ThemeToggle";

// Menu items
const items = [
  {
    title: "Dashboard",
    url: RoutePath.AdminDashboard,
    icon: LayoutDashboardIcon,
  },
  {
    title: "Users",
    url: RoutePath.AdminUsers,
    icon: User,
  },
  {
    title: "Expert Applications",
    url: RoutePath.AdminExpertApplications,
    icon: ShieldCheck,
  },
];

export const AdminSidebar = () => {
  const { mutate, isPending } = useLogout();
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="border-sidebar-border border-b px-3 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="h-8 w-8 object-contain" />
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-sidebar-foreground text-sm font-semibold">
                {APP_NAME}
              </p>
              <p className="text-muted-foreground text-[11px] uppercase tracking-[0.08em]">
                Admin
              </p>
            </div>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <ThemeToggle />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          className="w-full"
          disabled={isPending}
          onClick={() => {
            mutate();
          }}
        >
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
