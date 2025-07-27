import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";

export const AdminSidebarProvider = ({
  children,
}: {
  children?: React.ReactNode | undefined;
}) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};
