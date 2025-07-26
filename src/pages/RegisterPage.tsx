import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import {
  api,
  type ApiErrorResponseType,
  type ApiResponseType,
} from "../api/baseApi";
import { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";
import { Carousel } from "../components/ui/Carousel";
import { useNavigate } from "react-router";

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export const RegisterPage = () => {
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isPending, mutate } = useMutation<
    ApiResponseType,
    ApiErrorResponseType,
    z.infer<typeof registerSchema>
  >({
    mutationFn: async (body: z.infer<typeof registerSchema>) => {
      return api.post("/auth/register", body);
    },
    onError(error, variables) {
      if (error.response?.data) {
        if (error.response.data.errors) {
          for (const { error: message, field } of error.response.data.errors) {
            if (field)
              form.setError(field as keyof typeof variables, { message });
          }
        }
        if (error.response.data.message) {
          toast.error(error.response.data.message);
        }
      }
    },
    onSuccess(data) {
      if (data.data.message) toast.success(data.data.message);
      setRegistered(true);
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    mutate(values);
  }

  return (
    <div className="flex justify-between h-full bg-primary">
      <div className="w-2/3 h-screen text-background flex flex-col">
        <div className="p-8">
          <img src="logo.png" className="w-12" />
          <h1 className="text-xl ">Welcome to SkillStew</h1>
        </div>
        <Carousel />
      </div>
      <div className="flex flex-col items-start text-foreground justify-center p-48 w-full rounded-tl-4xl bg-background">
        {!registered ? (
          <>
            <div className="fixed right-8 top-8">
              Have an account?{" "}
              <span
                className="font-bold underline hover:cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Sign in
              </span>
            </div>
            <h1 className="text-3xl font-bold">Create your account</h1>
            <h1 className="text-l pt-2 pb-4 text-muted-foreground">
              Enter your email
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full"
              >
                <FormField
                  name="email"
                  control={form.control}
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="doherty@gmail.com" {...field} />
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
                <Button
                  type="submit"
                  disabled={isPending}
                  className="fixed right-8 bottom-8 font-bold"
                  size="lg"
                  variant="default"
                >
                  Register
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <CheckCircle2 size="6rem" color="green" />
            <h1 className="text-3xl font-semibold p-4 text-center">
              Check your email to confirm your account.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};
