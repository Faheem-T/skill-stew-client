import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import z from "zod";
import {
  api,
  type ApiErrorResponseType,
  type ApiResponseType,
  type ApiResponseWithMessage,
} from "@/shared/api/baseApi";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Button } from "@/shared/components/ui/button";
import { RoutePath } from "@/shared/config/routes";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { PasswordInput } from "@/shared/components/ui/password-input";

const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password has to be 8 characters")
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/\d/, "Password must include at least one number")
      .regex(
        /[@$!%*?&]/,
        "Password must include at least one special character (@$!%*?&)",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface SetPasswordBody {
  password: string;
  token: string;
}

type SetPasswordSchemaType = z.infer<typeof setPasswordSchema>;
export const SetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<SetPasswordSchemaType>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isPending, mutate } = useMutation<
    ApiResponseType,
    ApiErrorResponseType,
    SetPasswordBody
  >({
    mutationFn: async (body): Promise<ApiResponseWithMessage> => {
      return api.post("/auth/set-password", body);
    },

    onError(error) {
      if (error.response?.data) {
        if (error.response.data.errors) {
          for (const { message, field } of error.response.data.errors) {
            if (field)
              form.setError(field as keyof SetPasswordSchemaType, { message });
            else form.setError("root", { message });
          }
        }
      }
    },
  });

  async function onSubmit(values: z.infer<typeof setPasswordSchema>) {
    if (!token) {
      toast.error("Verification token not found. Please try again.");
      return;
    }
    mutate(
      { password: values.password, token: token },
      {
        onSuccess(data) {
          if (data.message) toast.success(data.message);
          navigate(RoutePath.Login);
        },
      },
    );
  }

  return (
    <AuthSplitLayout
      eyebrow="Account setup"
      title="Create a password you can rely on."
      description="Finish account setup with a strong password that matches the platform security requirements."
      aside={
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-background border-border rounded-lg border p-6">
            <LockKeyhole className="text-primary h-5 w-5" strokeWidth={1.5} />
            <p className="mt-6 text-sm font-semibold">Strong by default</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Use a mix of uppercase, lowercase, numbers, and symbols.
            </p>
          </div>
          <div className="bg-background border-border rounded-lg border p-6">
            <ShieldCheck className="text-primary h-5 w-5" strokeWidth={1.5} />
            <p className="mt-6 text-sm font-semibold">Protected access</p>
            <p className="text-muted-foreground mt-2 text-sm">
              This password secures future sign-ins and account recovery.
            </p>
          </div>
        </div>
      }
    >
      <div className="bg-card border-border rounded-lg border p-8">
        <h1 className="py-1 text-2xl font-semibold">Set Password</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <FormField
              name="password"
              control={form.control}
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="text-destructive text-sm">
                {form.formState.errors.root.message}
              </div>
            )}
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Saving..." : "Save password"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthSplitLayout>
  );
};
