import { createBrowserRouter } from "react-router";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/register/RegisterPage";
import { SetPasswordPage } from "@/features/auth/pages/SetPasswordPage";
import { HomePage } from "@/features/marketing/home/pages/HomePage";
import { AdminLoginPage } from "@/features/admin/pages/AdminLogin";
import { AdminDashboard } from "@/features/admin/pages/AdminDashboard";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AdminSidebarProvider } from "@/features/admin/components/layout/AdminSidebarProvider";
import { UserManagement } from "@/features/admin/pages/UserManagement";
import { SubscriptionManagement } from "@/features/admin/pages/SubscriptionManagement";
import { initialLoader } from "./loaders/initialLoader";
import { GuestRoute } from "./routes/GuestRoute";
import { InitialLoadScreen } from "./pages/InitialLoadScreen";
import { DashboardRoutingPage } from "./pages/DashboardRoutingPage";
import { UserDashboard } from "@/features/user/pages/UserDashboard";
import { ProfileStep } from "@/features/profile/pages/onboarding/ProfileStep";

export const router = createBrowserRouter([
  {
    hydrateFallbackElement: <InitialLoadScreen />,
    loader: initialLoader,
    children: [
      {
        path: "test",
        element: <ProfileStep />,
      },
      {
        path: "/",
        element: <HomePage />,
      },
      {
        // Guest only routes
        element: <GuestRoute />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/register",
            element: <RegisterPage />,
          },
          {
            path: "/set-password",
            element: <SetPasswordPage />,
          },
          {
            path: "/admin/login",
            element: <AdminLoginPage />,
          },
        ],
      },
      {
        // Authenticated users only routes
        element: <ProtectedRoute roles={["ADMIN", "EXPERT", "USER"]} />,
        children: [{ path: "/dashboard", element: <DashboardRoutingPage /> }],
      },
      {
        // USER only routes
        element: <ProtectedRoute roles={["USER"]} />,
        children: [
          { path: "dashboard/user", element: <UserDashboard /> },
          { path: "/onboarding/profile", element: <ProfileStep /> },
        ],
      },
      {
        // ADMIN only routes
        element: <ProtectedRoute roles={["ADMIN"]} />,
        children: [
          {
            element: <AdminSidebarProvider />,
            children: [
              { path: "/admin/dashboard", element: <AdminDashboard /> },
              {
                path: "/admin/users",
                element: <UserManagement />,
              },
              {
                path: "/admin/subscriptions",
                element: <SubscriptionManagement />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
