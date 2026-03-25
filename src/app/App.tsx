import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router";
import { router, queryClient } from "./router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/shared/theme/theme";

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="bottom-left"
          gutter={14}
          containerStyle={{
            bottom: 24,
            left: 24,
          }}
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--popover)",
              color: "var(--popover-foreground)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              boxShadow: "var(--shadow-md)",
              padding: "14px 16px",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              lineHeight: "1.45",
              maxWidth: "420px",
            },
            success: {
              duration: 3500,
              iconTheme: {
                primary: "var(--success)",
                secondary: "var(--success-foreground)",
              },
              style: {
                background: "var(--success-muted)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "var(--destructive)",
                secondary: "var(--destructive-foreground)",
              },
              style: {
                background: "var(--popover)",
                border: "1px solid var(--destructive)",
              },
            },
            loading: {
              iconTheme: {
                primary: "var(--info)",
                secondary: "var(--info-foreground)",
              },
              style: {
                background: "var(--info-muted)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              },
            },
          }}
        />
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
