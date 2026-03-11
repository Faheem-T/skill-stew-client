import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router";
import { router, queryClient } from "./router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <>
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
              border: "1px solid color-mix(in srgb, var(--border) 82%, white)",
              borderRadius: "20px",
              boxShadow:
                "0 20px 50px rgba(15, 23, 42, 0.12), 0 6px 18px rgba(15, 23, 42, 0.08)",
              padding: "14px 16px",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              lineHeight: "1.45",
              maxWidth: "420px",
            },
            success: {
              duration: 3500,
              iconTheme: {
                primary: "var(--primary)",
                secondary: "var(--accent)",
              },
              style: {
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--accent) 40%, white), var(--popover))",
                border:
                  "1px solid color-mix(in srgb, var(--accent) 55%, var(--border))",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "var(--destructive)",
                secondary: "var(--destructive-foreground)",
              },
              style: {
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--destructive) 12%, white), var(--popover))",
                border:
                  "1px solid color-mix(in srgb, var(--destructive) 28%, var(--border))",
              },
            },
            loading: {
              iconTheme: {
                primary: "var(--primary)",
                secondary: "var(--accent)",
              },
              style: {
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, white), var(--popover))",
                border:
                  "1px solid color-mix(in srgb, var(--primary) 18%, var(--border))",
              },
            },
          }}
        />
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default App;
