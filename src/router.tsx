import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SetPasswordPage } from "./pages/SetPasswordPage";
import { HomePage } from "./pages/HomePage";
import { AdminLoginPage } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ProtectedRoute } from "./pages/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "test",
    element: <AdminDashboard />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
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
  {
    element: <ProtectedRoute roles={["ADMIN"]} />,
    children: [{ path: "/admin/dashboard", element: <AdminDashboard /> }],
  },
]);
