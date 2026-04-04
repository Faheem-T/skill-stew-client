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
import { useEffect } from "react";
import { loginSchema, loginRequest } from "@/features/auth/api/LoginRequest";
import type { ApiErrorResponseType } from "@/shared/api/baseApi";
import { useNavigate, useSearchParams } from "react-router";
import { useAppStore } from "@/app/store";
import { GoogleLoginButton } from "@/features/auth/components/GoogleAuthButton";
import { PasswordInput } from "@/shared/components/ui/password-input";
import { ArrowRight, BookOpen, CircleCheck, Users } from "lucide-react";
import useCurrentUserProfile, {
  CURRENT_USER_PROFILE_QUERY_KEY,
} from "@/shared/hooks/useCurrentUserProfile";
import { InitialLoadScreen } from "@/app/pages/InitialLoadScreen";
import { RoutePath } from "@/shared/config/routes";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { Link } from "react-router";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading } = useCurrentUserProfile();
  const redirectPath = searchParams.get("redirect");
  const safeRedirect =
    redirectPath && redirectPath.startsWith("/") ? redirectPath : null;

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
    onError(error) {
      if (error.response?.data) {
        if (error.response.data.errors) {
          for (const { message, field } of error.response.data.errors) {
            if (field) {
              form.setError(field as keyof z.infer<typeof loginSchema>, {
                message,
              });
            } else {
              form.setError("root", { message });
            }
          }
        }
      }
    },
    async onSuccess(data) {
      setAccessToken(data.data.accessToken);
      queryClient.invalidateQueries({
        queryKey: CURRENT_USER_PROFILE_QUERY_KEY,
      });
      navigate(safeRedirect ?? RoutePath.Dashboard, { replace: true });
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    mutate(values);
  }

  useEffect(() => {
    if (userProfile) {
      navigate(safeRedirect ?? RoutePath.Home, { replace: true });
    }
  }, [userProfile, navigate, safeRedirect]);

  if (isLoading) {
    return <InitialLoadScreen />;
  }

  return (
    <AuthSplitLayout
      eyebrow="Welcome back"
      title="Pick up where your learning left off."
      description="Return to your workshops, expert applications, and community activity without losing your place."
      aside={
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: "Live cohorts",
              body: "Rejoin structured sessions and track your progress.",
            },
            {
              icon: Users,
              title: "Community",
              body: "Keep discussions and connections moving between sessions.",
            },
            {
              icon: CircleCheck,
              title: "Verified experts",
              body: "Learn from instructors with a trust-first review flow.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-background border-border rounded-lg border p-6">
              <Icon className="text-primary h-5 w-5" strokeWidth={1.5} />
              <p className="mt-6 text-sm font-semibold">{title}</p>
              <p className="text-muted-foreground mt-2 text-sm">{body}</p>
            </div>
          ))}
        </div>
      }
      footer={
        <p className="text-muted-foreground text-sm">
          By signing in, you agree to our{" "}
          <a href="#" className="text-foreground underline underline-offset-4">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-foreground underline underline-offset-4">
            Privacy Policy
          </a>
          .
        </p>
      }
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">No account yet?</span>
        <button
          className="text-foreground inline-flex items-center gap-1 font-medium"
          onClick={() => navigate(RoutePath.Register)}
          type="button"
        >
          Create one <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="bg-card border-border rounded-lg border p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground">Sign in</h2>
          <p className="text-muted-foreground mt-2">
            Enter your credentials to continue.
          </p>
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
                    <Input placeholder="you@example.com" className="h-11" {...field} />
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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="border-border w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card text-muted-foreground px-4">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <GoogleLoginButton expectedRole="USER" />
            </div>
          </form>
        </Form>
      </div>

      <p className="text-muted-foreground text-sm">
        Want to teach?{" "}
        <Link
          to={RoutePath.ExpertRegister}
          className="text-foreground underline underline-offset-4"
        >
          Start an expert account
        </Link>
        .
      </p>
    </AuthSplitLayout>
  );
};
