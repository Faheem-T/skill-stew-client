import { createBrowserRouter } from "react-router";
import { QueryClient } from "@tanstack/react-query";
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
import { UserProfilePage } from "@/features/user/pages/UserProfilePage";
import { PublicUserProfilePage } from "@/features/user/pages/PublicUserProfilePage";
import { AppRoot } from "./AppRoot";
import { RoutePath } from "@/shared/config/routes";
import { NotificationsPage } from "@/features/notification/pages/NotificationsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ExpertApplicationPage } from "@/features/expert/pages/ExpertApplicationPage";

export const queryClient = new QueryClient();

export const router = createBrowserRouter([
  {
    hydrateFallbackElement: <InitialLoadScreen />,
    loader: initialLoader,
    element: <AppRoot />,
    children: [
      {
        path: RoutePath.TestRoute,
        element: <ExpertApplicationPage />,
      },
      {
        path: RoutePath.Home,
        element: <HomePage />,
      },
      {
        path: RoutePath.PublicProfile,
        element: <PublicUserProfilePage />,
      },
      {
        // Guest only routes
        element: <GuestRoute />,
        children: [
          {
            path: RoutePath.Login,
            element: <LoginPage />,
          },
          {
            path: RoutePath.Register,
            element: <RegisterPage />,
          },
          {
            path: RoutePath.ExpertApplication,
            element: <ExpertApplicationPage />,
          },
          {
            path: RoutePath.SetPassword,
            element: <SetPasswordPage />,
          },
          {
            path: RoutePath.AdminLogin,
            element: <AdminLoginPage />,
          },
        ],
      },
      {
        // Authenticated users only routes
        element: <ProtectedRoute roles={["ADMIN", "EXPERT", "USER"]} />,
        children: [
          { path: RoutePath.Dashboard, element: <DashboardRoutingPage /> },
          {
            path: RoutePath.Notifications,
            element: <NotificationsPage />,
          },
        ],
      },
      {
        // USER only routes
        element: <ProtectedRoute roles={["USER"]} />,
        children: [
          { path: RoutePath.UserDashboard, element: <UserDashboard /> },
          { path: RoutePath.UserProfile, element: <UserProfilePage /> },
        ],
      },
      {
        // ADMIN only routes
        element: <ProtectedRoute roles={["ADMIN"]} />,
        children: [
          {
            element: <AdminSidebarProvider />,
            children: [
              { path: RoutePath.AdminDashboard, element: <AdminDashboard /> },
              {
                path: RoutePath.AdminUsers,
                element: <UserManagement />,
              },
              {
                path: RoutePath.AdminSubscriptions,
                element: <SubscriptionManagement />,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
