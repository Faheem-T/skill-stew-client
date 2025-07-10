import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SetPasswordPage } from "./pages/SetPasswordPage";
import { HomePage } from "./pages/HomePage";

export const router = createBrowserRouter([
    {
        path:"/",
        element: <HomePage />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
    {
        path: "/set-password",
        element: <SetPasswordPage />
    }
])