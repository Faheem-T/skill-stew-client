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
    <div className="rounded-4xl border border-stone-200 bg-stone-50 p-8 shadow-[0_24px_80px_-48px_rgba(68,26,26,0.45)] sm:p-10">
      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          Expert access
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">
            Create your expert account
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
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
                <FormLabel className="text-stone-700">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="expert@example.com"
                    className="h-12 rounded-xl border-stone-300 bg-white focus-visible:border-primary focus-visible:ring-primary/20"
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
                <FormLabel className="text-stone-700">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Create a strong password"
                    className="h-12 rounded-xl border-stone-300 bg-white focus-visible:border-primary focus-visible:ring-primary/20"
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
                <FormLabel className="text-stone-700">
                  Confirm password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Confirm your password"
                    autoComplete="off"
                    className="h-12 rounded-xl border-stone-300 bg-white focus-visible:border-primary focus-visible:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {form.formState.errors.root.message}
            </div>
          )}

          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isPending}
          >
            {isPending ? "Creating expert account..." : "Continue as expert"}
          </Button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-stone-500">
              <span className="bg-stone-50 px-3">Or use Google</span>
            </div>
          </div>

          <div className="flex justify-center rounded-xl border border-dashed border-stone-200 bg-white px-4 py-4">
            <GoogleLoginButton expectedRole="EXPERT_APPLICANT" />
          </div>
        </form>
      </Form>
    </div>
  );
};
