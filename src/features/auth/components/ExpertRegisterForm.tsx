import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";
import { expertRegisterRequest } from "@/features/auth/api/ExpertRegisterRequest";
import { GoogleLoginButton } from "@/features/auth/components/GoogleAuthButton";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { PasswordInput } from "@/shared/components/ui/password-input";
import { RoutePath } from "@/shared/config/routes";
import type {
  ApiErrorResponseType,
  ApiResponseWithMessage,
} from "@/shared/api/baseApi";

const expertRegisterSchema = z
  .object({
    email: z.email("Please enter a valid email address."),
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

type ExpertRegisterSchemaType = z.infer<typeof expertRegisterSchema>;

export const ExpertRegisterForm = () => {
  const navigate = useNavigate();

  const form = useForm<ExpertRegisterSchemaType>({
    defaultValues: { email: "", password: "", confirmPassword: "" },
    resolver: zodResolver(expertRegisterSchema),
  });

  const { mutate, isPending } = useMutation<
    ApiResponseWithMessage,
    ApiErrorResponseType,
    ExpertRegisterSchemaType
  >({
    mutationFn: async (body) => {
      return expertRegisterRequest({
        email: body.email,
        password: body.password,
      });
    },
  });

  const onSubmit = (values: ExpertRegisterSchemaType) => {
    mutate(values, {
      onSuccess() {
        navigate(RoutePath.ExpertRegisterVerifyEmail, {
          replace: true,
          state: { email: values.email },
        });
      },
      onError(error) {
        const data = error.response?.data;
        if (!data) return;

        data.errors?.forEach(({ field, message }) => {
          if (field === "email" || field === "password") {
            form.setError(field, { message });
            return;
          }

          form.setError("root", {
            message,
          });
        });
      },
    });
  };

  return (
    <div className="bg-card border-border rounded-lg border p-8 sm:p-10">
      <div className="mb-8 space-y-3">
        <div className="bg-secondary text-secondary-foreground inline-flex items-center rounded-sm border border-transparent px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em]">
          Expert access
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Create your expert account
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Set up your account to begin your expert verification journey on
            Skill Stew.
          </p>
        </div>
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
                  <Input
                    {...field}
                    placeholder="expert@example.com"
                    className="h-11"
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Create a strong password"
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Confirm your password"
                    autoComplete="off"
                    className="h-11"
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

          <Button
            type="submit"
            className="h-11 w-full"
            disabled={isPending}
          >
            {isPending ? "Creating expert account..." : "Continue as expert"}
          </Button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="border-border w-full border-t" />
            </div>
            <div className="text-muted-foreground relative flex justify-center text-[11px] font-medium uppercase tracking-[0.08em]">
              <span className="bg-card px-3">Or use Google</span>
            </div>
          </div>

          <div className="border-border flex justify-center rounded-lg border px-4 py-4">
            <GoogleLoginButton expectedRole="EXPERT_APPLICANT" />
          </div>
        </form>
      </Form>
    </div>
  );
};
