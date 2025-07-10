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
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { api, type ApiErrorResponseType, type ApiResponseType } from "../api/baseApi";
import { useState } from "react";
import toast from "react-hot-toast";
import { Check, CheckCircle2 } from "lucide-react";

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export const RegisterPage = () => {
  
  const [registered, setRegistered] = useState(false);
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isPending, mutate } = useMutation<ApiResponseType<{}>, ApiErrorResponseType, z.infer<typeof registerSchema>>({
    mutationFn: async (body: z.infer<typeof registerSchema>) => {return api.post("/users/register", body)},
    onError(error, variables, context) {
        if (error.response?.data) {
            if (error.response.data.errors) {
            for (const {error: message, field} of error.response.data.errors){
                if (field) form.setError(field as keyof typeof variables, {message})
            }}
            if (error.response.data.message) {
                toast.error(error.response.data.message)
            }
        }
    },
    onSuccess(data, variables, context) {
      if (data.data.message) toast.success(data.data.message)
      setRegistered(true);
    },
  });


  async function onSubmit(values: z.infer<typeof registerSchema>) {
    mutate(values);
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 h-screen">
      {!registered ? <>
      <h1 className="text-3xl font-bold p-4">Welcome to SkillStew</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="email"
            control={form.control}
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
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
      </>
: <>
  <CheckCircle2 size="6rem" color="green"/>
  <h1 className="text-3xl font-bold p-4 text-center">Check your email to confirm your account.</h1>
</>}
    </div>
  );
};
