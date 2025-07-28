import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import z from "zod";
import {
  api,
  type ApiErrorResponseType,
  type ApiResponseType,
} from "../api/baseApi";
import toast from "react-hot-toast";
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
import { Carousel } from "@/components/ui/Carousel";

export const setPasswordSchema = z
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
    mutationFn: async (body) => {
      return api.post("/auth/set-password", body);
    },

    onError(error) {
      if (error.response?.data) {
        if (error.response.data.errors) {
          for (const { error: message, field } of error.response.data.errors) {
            if (field)
              form.setError(field as keyof SetPasswordSchemaType, { message });
          }
        }
        if (error.response.data.message) {
          toast.error(error.response.data.message);
        }
      }
    },
    onSuccess(data) {
      if (data.data.message) toast.success(data.data.message);
      navigate("/login");
    },
  });

  async function onSubmit(values: z.infer<typeof setPasswordSchema>) {
    if (!token) {
      toast.error("Verification token not found. Please try again.");
      return;
    }
    mutate({ password: values.password, token: token });
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
        <h1 className="text-3xl font-bold py-4">Set Password</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              name="password"
              control={form.control}
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
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
                    <Input
                      placeholder="Confirm password"
                      type="password"
                      {...field}
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
      </div>
    </div>
  );
};
