import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";

export const AdminSidebarProvider = () => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
