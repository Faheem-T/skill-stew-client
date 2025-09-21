import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SetPasswordPage } from "./pages/SetPasswordPage";
import { HomePage } from "./pages/Homepage";
import { AdminLoginPage } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { AdminSidebarProvider } from "./components/custom/AdminSidebarProvider";
import { UserManagement } from "./pages/admin/UserManagement";
import { SubscriptionManagement } from "./pages/admin/SubscriptionManagement";
import { initialLoader } from "./lib/initialLoader";
import { GuestRoute } from "./pages/GuestRoute";
import { InitialLoadScreen } from "./pages/InitialLoadScreen";

export const router = createBrowserRouter([
  {
    hydrateFallbackElement: <InitialLoadScreen />,
    loader: initialLoader,
    children: [
      {
        path: "test",
        element: <InitialLoadScreen />,
      },
      {
        path: "/",
        element: <HomePage />,
      },
      {
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
