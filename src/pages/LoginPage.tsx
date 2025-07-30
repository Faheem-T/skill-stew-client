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
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/auth/LoginRequest";
import type { ApiErrorResponseType } from "../api/baseApi";
import { useNavigate } from "react-router";
import { useAppStore } from "@/store";
import { GoogleLoginButton } from "@/components/custom/GoogleAuthButton";

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

  const { mutate } = useMutation<
    Awaited<ReturnType<typeof loginRequest>>,
    ApiErrorResponseType,
    z.infer<typeof loginSchema>
  >({
    mutationFn: loginRequest,
    onError(error, variables) {
      if (error.response?.data) {
        if (error.response.data.errors) {
          for (const { error: message, field } of error.response.data.errors) {
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

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    mutate(values, {
      onSuccess(data) {
        setAccessToken(data.data.data.accessToken);
        navigate("/");
      },
    });
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center p-8 h-screen">
        <div className="fixed right-8 top-8">
          Don't have an account?{" "}
          <span
            className="font-bold underline hover:cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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
                    <Input placeholder="password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Login</Button>
            {form.formState.errors.root && (
              <div className="text-red-500 text-sm">
                {form.formState.errors.root.message}
              </div>
            )}
          </form>
        </Form>
      </div>
      <GoogleLoginButton />
    </>
  );
};
