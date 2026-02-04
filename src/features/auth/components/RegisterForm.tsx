import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PasswordInput } from "@/shared/components/ui/password-input";
import z from "zod";
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
import {
  registerRequest,
  type RegisterErrorResponseType,
  type RegisterResponseType,
} from "@/features/auth/api/RegisterRequest";
import type { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "@/app/store";
import { useNavigate } from "react-router";
import { GoogleLoginButton } from "@/features/auth/components/GoogleAuthButton";

const registerSchema = z
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

type registerSchemaType = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation<
    RegisterResponseType,
    AxiosError<RegisterErrorResponseType>,
    z.infer<typeof registerSchema>
  >({
    mutationFn: async (body: z.infer<typeof registerSchema>) => {
      return registerRequest(body);
    },
  });

  const form = useForm<registerSchemaType>({
    defaultValues: { email: "", password: "", confirmPassword: "" },
    resolver: zodResolver(registerSchema),
  });

  const { handleSubmit, control, reset } = form;

  const onSubmit = async (formData: registerSchemaType) => {
    mutate(formData, {
      onSuccess(data) {
        setAccessToken(data.data.accessToken);
        reset();
        navigate("/dashboard");
      },
      onError(error) {
        if (error.response) {
          const { userAlreadyExists } = error.response.data;
          if (userAlreadyExists) {
            form.setError(
              "email",
              {
                message: "This email is already in use",
              },
              { shouldFocus: true },
            );
          }
        }
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Create your account
        </h2>
        <p className="text-slate-500 mt-2">Enter your details to get started</p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            name="email"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="you@example.com"
                    className="h-11 border-slate-200 focus:border-primary focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Create a strong password"
                    className="h-11 border-slate-200 focus:border-primary focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Confirm your password"
                    autoComplete="off"
                    className="h-11 border-slate-200 focus:border-primary focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Create account"}
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
  );
};
