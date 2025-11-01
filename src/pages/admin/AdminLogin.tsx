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
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import type { ApiErrorResponseType } from "../../api/baseApi";
import { useNavigate } from "react-router";
import { adminLoginRequest } from "@/api/auth/AdminLoginRequest";
import { useAppStore } from "@/store";
import { PasswordInput } from "@/components/ui/password-input";

export const adminLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const AdminLoginPage = () => {
  const navigate = useNavigate();

  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const setUser = useAppStore((state) => state.setUser);

  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate } = useMutation<
    Awaited<ReturnType<typeof adminLoginRequest>>,
    ApiErrorResponseType,
    z.infer<typeof adminLoginSchema>
  >({
    mutationFn: adminLoginRequest,
    onError(error, variables, _context) {
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

  async function onSubmit(values: z.infer<typeof adminLoginSchema>) {
    mutate(values, {
      onSuccess: (response) => {
        setAccessToken(response.data.accessToken);
        setUser({ role: "ADMIN", username: "something" });
        navigate("/admin/dashboard");
      },
    });
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 h-screen">
      <h1 className="text-3xl font-bold">Welcome back!</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                    {...field}
                    placeholder="password"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root && (
            <div className="text-red-500 text-sm">
              {form.formState.errors.root.message}
            </div>
          )}
          <Button type="submit">Login</Button>
        </form>
      </Form>
    </div>
  );
};
