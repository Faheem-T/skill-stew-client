import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {useParams, useSearchParams} from "react-router"
import z from "zod";
import { api, type ApiErrorResponseType, type ApiResponseType } from "../api/baseApi";
import toast from "react-hot-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export const setPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password has to be 8 characters")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/\d/, "Password must include at least one number")
    .regex(/[@$!%*?&]/, "Password must include at least one special character (@$!%*?&)"),  
confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

interface SetPasswordBody {
    password: string;
    token: string;
}

type SetPasswordSchemaType = z.infer<typeof setPasswordSchema>
export const SetPasswordPage = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    
  const form = useForm<SetPasswordSchemaType>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
  });

  const { isPending, mutate } = useMutation<ApiResponseType<{}>, ApiErrorResponseType, SetPasswordBody>({
    mutationFn: async (body) => {return api.post("/users/set-password", body)},

    onError(error, variables, context) {
        if (error.response?.data) {
            if (error.response.data.errors) {
            for (const {error: message, field} of error.response.data.errors){
                if (field) form.setError(field as keyof SetPasswordSchemaType , {message})
            }}
            if (error.response.data.message) {
                toast.error(error.response.data.message)
            }
        }
    },
    onSuccess(data, variables, context) {
      if (data.data.message) toast.success(data.data.message)
    },
  });


  async function onSubmit(values: z.infer<typeof setPasswordSchema>) {
    if(!token) {
        toast.error("Verification token not found. Please try again.")
        return;
    }
    mutate({password: values.password, token: token});
  }
    
  return <div>
    
    <div className="flex flex-col items-center justify-center p-8 h-screen">
      <h1 className="text-3xl font-bold p-4">Set Password</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <Input placeholder="Confirm password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
                
          {form.formState.errors.root &&
                    <div className="text-red-500 text-sm">{form.formState.errors.root.message}</div>
            }
          <Button type="submit" disabled={isPending}>Register</Button>
        </form>
      </Form>
      </div>
  </div>;
};
