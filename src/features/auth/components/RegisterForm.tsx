import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PasswordInput } from "@/shared/components/ui/password-input";
import z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { cn } from "@/shared/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
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
  const [step, setStep] = useState<number>(0);
  const totalSteps = 2;
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

  const {
    handleSubmit,
    control,
    reset,
    trigger,
    formState: { errors },
  } = form;

  const onSubmit = async (formData: registerSchemaType) => {
    mutate(formData, {
      onSuccess(data) {
        setAccessToken(data.data.accessToken);
        setStep(0);
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
            setStep(0);
          }
        }
      },
    });
  };

  const handleEmailNext = async () => {
    if (errors.email) return;
    const valid = await trigger("email");
    if (valid) handleNext();
  };

  const handleNext = () => {
    setStep((prev) => (prev < totalSteps ? prev + 1 : prev));
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                "w-4 h-4 rounded-full transition-all duration-300 ease-in-out",
                index <= step ? "bg-primary" : "bg-primary/30",
                index < step && "bg-primary",
              )}
            />
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5",
                  index < step ? "bg-primary" : "bg-primary/30",
                )}
              />
            )}
          </div>
        ))}
      </div>
      <Card className="shadow-sm">
        <CardHeader>
          <h1 className="text-3xl font-bold">Create your account</h1>
        </CardHeader>
        <CardContent>
          {step === 0 && (
            <Form {...form}>
              <form onSubmit={handleEmailNext} className="grid gap-y-4">
                <FormField
                  key="email"
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: doherty@gmail.com" />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button
                    type="button"
                    className="font-medium"
                    size="sm"
                    onClick={handleBack}
                    disabled={step === 0}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="font-medium"
                    onClick={handleEmailNext}
                    disabled={!!errors.email}
                  >
                    Next
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {step === 1 && (
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">
                <FormField
                  key="password"
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          placeholder="Create a strong password"
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  key="confirmPassword"
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          placeholder="Confirm your password"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button
                    type="button"
                    className="font-medium"
                    size="sm"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="font-medium"
                    disabled={isPending}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-slate-50 text-slate-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <GoogleLoginButton />
      </div>
    </div>
  );
};
