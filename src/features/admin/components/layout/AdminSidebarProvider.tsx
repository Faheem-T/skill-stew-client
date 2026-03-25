import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";

export const AdminSidebarProvider = () => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="bg-background min-h-screen w-full">
        <div className="border-border bg-background/95 sticky top-0 z-30 flex h-14 items-center border-b px-4 md:hidden">
          <SidebarTrigger />
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
