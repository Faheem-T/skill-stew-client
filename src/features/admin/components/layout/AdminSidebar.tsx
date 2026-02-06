import { CircleDollarSignIcon, LayoutDashboardIcon, User } from "lucide-react";
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
    title: "Subscription Plans",
    url: RoutePath.AdminSubscriptions,
    icon: CircleDollarSignIcon,
  },
];

export const AdminSidebar = () => {
  const { mutate, isPending } = useLogout();
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader></SidebarHeader>
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
