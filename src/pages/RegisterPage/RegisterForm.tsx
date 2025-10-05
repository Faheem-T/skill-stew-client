import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  registerRequest,
  type RegisterErrorResponseType,
  type RegisterResponseType,
} from "@/api/auth/RegisterRequest";
import type { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

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
  const [step, setStep] = useState<number>(0);
  const totalSteps = 2;

  const { isPending, mutate } = useMutation<
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
    console.log(formData);

    mutate(formData, {
      onSuccess(data) {
        toast.success("Form successfully submitted");
        toast.success(data.message);
        setStep(0);
        reset();
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
                          autoComplete="off"
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
                  <Button type="submit" size="sm" className="font-medium">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
