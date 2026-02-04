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
import { adminLoginRequest } from "@/features/admin/api/auth/AdminLoginRequest";
import { useAppStore } from "@/app/store";
import { PasswordInput } from "@/shared/components/ui/password-input";
import { loginRequest } from "@/features/auth/api/LoginRequest";
import { APP_NAME } from "@/shared/config/constants";
import { Shield } from "lucide-react";
import { CURRENT_USER_PROFILE_QUERY_KEY } from "@/shared/hooks/useCurrentUserProfile";

export const adminLoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

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
    onError(error, variables, _context) {
      if (error.response?.data) {
        if (error.response.data.errors) {
          for (const { field, message } of error.response.data.errors) {
            if (field)
              form.setError(field as keyof typeof variables, { message });
          }
        }
        if (error.response.data.message) {
          form.setError("root", { message: error.response.data.message });
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
        navigate("/dashboard/admin");
      },
    });
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/15 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.png" className="h-12 w-12 object-contain" />
            <span className="text-2xl font-bold">{APP_NAME}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Admin Portal</h1>
          <p className="text-lg text-white/80 max-w-md">
            Manage your platform, monitor user activity, and keep things running
            smoothly.
          </p>
          <div className="mt-8 flex items-center gap-2 text-white/60">
            <Shield className="w-5 h-5" />
            <span>Secure administrative access</span>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img src="/logo.png" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-slate-900">{APP_NAME}</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
              <p className="text-slate-500 mt-2">
                Enter your admin credentials
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@example.com"
                          className="h-11 border-slate-200 focus:border-slate-900 focus:ring-slate-900/20"
                          {...field}
                        />
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
                      <FormLabel className="text-slate-700">Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter your password"
                          className="h-11 border-slate-200 focus:border-slate-900 focus:ring-slate-900/20"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    {form.formState.errors.root.message}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                  disabled={isPending}
                >
                  {isPending ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            This is a restricted area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};
