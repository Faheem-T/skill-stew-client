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
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "@/features/auth/api/LoginRequest";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";
import { useNavigate } from "react-router";
import { useAppStore } from "@/app/store";
import { GoogleLoginButton } from "@/features/auth/components/GoogleAuthButton";
import { fetchProfile } from "@/features/auth/lib/fetchProfile";
import { PasswordInput } from "@/shared/components/ui/password-input";
import { APP_NAME } from "@/shared/config/constants";
import { Sparkles } from "lucide-react";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string(),
});

export const LoginPage = () => {
  const navigate = useNavigate();

  const user = useAppStore((state) => state.user);
  const setAccessToken = useAppStore((state) => state.setAccessToken);

  if (user) {
    navigate("/");
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation<
    Awaited<ReturnType<typeof loginRequest>>,
    ApiErrorResponseType,
    z.infer<typeof loginSchema>
  >({
    mutationFn: loginRequest,
    onError(error, variables) {
      if (error.response?.data) {
        if (error.response.data.errors) {
          for (const { message, field } of error.response.data.errors) {
            if (field)
              form.setError(field as keyof typeof variables, { message });
          }
        }
        if (error.response.data.message) {
          form.setError("root", { message: error.response.data.message });
        }
      }
    },
    async onSuccess(data) {
      setAccessToken(data.data.accessToken);

      await fetchProfile();

      navigate("/");
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    mutate(values);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/15 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.png" className="h-12 w-12 object-contain" />
            <span className="text-2xl font-bold">{APP_NAME}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
          <p className="text-lg text-white/80 max-w-md">
            Continue your skill exchange journey. Connect with learners and
            experts in our community.
          </p>
          <div className="mt-8 flex items-center gap-2 text-white/60">
            <Sparkles className="w-5 h-5" />
            <span>Share skills, grow together</span>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="absolute right-8 top-8 text-sm text-slate-600">
          Don't have an account?{" "}
          <span
            className="font-semibold text-primary hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </div>

        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img src="/logo.png" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-primary">{APP_NAME}</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
              <p className="text-slate-500 mt-2">
                Enter your credentials to continue
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
                          placeholder="you@example.com"
                          className="h-11 border-slate-200 focus:border-primary focus:ring-primary/20"
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
                          className="h-11 border-slate-200 focus:border-primary focus:ring-primary/20"
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
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  disabled={isPending}
                >
                  {isPending ? "Signing in..." : "Sign in"}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <GoogleLoginButton />
                </div>
              </form>
            </Form>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            By signing in, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
