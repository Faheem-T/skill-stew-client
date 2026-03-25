import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";
import { useNavigate } from "react-router";
import {
  adminLoginRequest,
  adminLoginSchema,
} from "@/features/admin/api/auth/AdminLoginRequest";
import { useAppStore } from "@/app/store";
import { PasswordInput } from "@/shared/components/ui/password-input";
import { loginRequest } from "@/features/auth/api/LoginRequest";
import { APP_NAME } from "@/shared/config/constants";
import { Shield } from "lucide-react";
import { CURRENT_USER_PROFILE_QUERY_KEY } from "@/shared/hooks/useCurrentUserProfile";
import { RoutePath } from "@/shared/config/routes";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";

export const AdminLoginPage = () => {
  const navigate = useNavigate();

  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation<
    Awaited<ReturnType<typeof adminLoginRequest>>,
    ApiErrorResponseType,
    z.infer<typeof adminLoginSchema>
  >({
    mutationFn: loginRequest,
    onError(error) {
      if (error.response?.data) {
        if (error.response.data.errors) {
          for (const { field, message } of error.response.data.errors) {
            if (field) {
              form.setError(field as keyof z.infer<typeof adminLoginSchema>, {
                message,
              });
            } else {
              form.setError("root", { message });
            }
          }
        }
      }
    },
  });

  async function onSubmit(values: z.infer<typeof adminLoginSchema>) {
    mutate(values, {
      onSuccess: async (response) => {
        setAccessToken(response.data.accessToken);
        await queryClient.invalidateQueries({
          queryKey: CURRENT_USER_PROFILE_QUERY_KEY,
        });
        navigate(RoutePath.AdminDashboard);
      },
    });
  }

  return (
    <AuthSplitLayout
      eyebrow="Restricted access"
      title="Admin access for platform operations."
      description="Use administrator credentials to manage users, review expert applications, and monitor platform health."
      aside={
        <div className="bg-background border-border rounded-lg border p-6">
          <Shield className="text-primary h-5 w-5" strokeWidth={1.5} />
          <p className="mt-6 text-sm font-semibold">Secure administrative entry</p>
          <p className="text-muted-foreground mt-2 text-sm">
            This area is reserved for platform administrators only.
          </p>
        </div>
      }
      footer={
        <p className="text-muted-foreground text-sm">
          Restricted area. Unauthorized access is prohibited.
        </p>
      }
    >
      <div className="bg-card border-border rounded-lg border p-8">
        <div className="mb-8">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.08em]">
            {APP_NAME}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-foreground">Admin Login</h2>
          <p className="text-muted-foreground mt-2">Enter your admin credentials.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter your password"
                      className="h-11"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="border-destructive/30 text-destructive rounded-lg border px-4 py-3 text-sm">
                {form.formState.errors.root.message}
              </div>
            )}

            <Button type="submit" className="h-11 w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthSplitLayout>
  );
};
