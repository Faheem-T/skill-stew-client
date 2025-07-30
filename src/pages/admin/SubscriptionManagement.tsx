import type {
  ApiErrorResponseType,
  ApiResponseWithData,
  ApiResponseWithMessage,
} from "@/api/baseApi";
import {
  createPlan,
  createSubscriptionPlanSchema,
  deletePlan,
  editPlan,
  editSubscriptionPlanSchema,
  getSubscriptionPlans,
  type SubscriptionPlan,
} from "@/api/subscriptions";
import { AdminTopBar } from "@/components/custom/AdminTopbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Edit, Trash, X } from "lucide-react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import { produce } from "immer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SubscriptionManagement: React.FC<{}> = () => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  return (
    <div>
      <AdminTopBar
        mainText="Subscription Management"
        subText="Manage"
        sideItems={
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button>Create Plan</Button>
            </DialogTrigger>
            <PlanFormDialog
              closeModal={() => {
                setModalOpen(false);
              }}
            />
          </Dialog>
        }
      />
      <div className="p-8">
        <SubscriptionPlansTable />
      </div>
    </div>
  );
};

const SubscriptionPlansTable: React.FC = () => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryFn: getSubscriptionPlans,
    queryKey: ["subscription-plans"],
  });

  if (isFetching || isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  if (!data) {
    return <div>Couldn't fetch data!</div>;
  }

  const plans = data.data.data;
  return (
    <Table className="">
      <TableHeader>
        <TableRow>
          <TableHead>Plan</TableHead>
          <TableHead>Pricing</TableHead>
          <TableHead>Free Workshop Hours</TableHead>
          <TableHead>Subscribers</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.map((plan) => (
          <SubscriptionPlanRow key={plan.id} plan={plan} />
        ))}
      </TableBody>
    </Table>
  );
};

const SubscriptionPlanRow: React.FC<{ plan: SubscriptionPlan }> = ({
  plan,
}) => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  const {
    name,
    description,
    price: { currency, monthly, yearly },
    features,
    freeWorkshopHours,
    active,
  } = plan;

  const monthlyPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(monthly);
  const yearlyPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(yearly);

  const featuresBadges = features
    .slice(0, 2)
    .map((feature) => <Badge variant="outline">{feature}</Badge>);

  return (
    <TableRow>
      <TableCell className="flex flex-col gap-1">
        <div className="font-semibold text-md">{name}</div>
        <div className="text-muted-foreground">{description}</div>
        <div className="flex gap-1">
          {...featuresBadges}
          {features.length > 2 && (
            <Badge variant="outline">+{features.length - 2} more</Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div>{monthlyPrice}/mo</div>
        <div className="text-muted-foreground">{yearlyPrice}/yr</div>
      </TableCell>
      <TableCell className="flex gap-1 items-center">
        <Clock size="15px" className="text-muted-foreground" />
        <span>{freeWorkshopHours}</span>
      </TableCell>
      <TableCell>200</TableCell>
      <TableCell>
        {active ? (
          <Badge className="font-semibold">active</Badge>
        ) : (
          <Badge className="font-semibold" variant="outline">
            inactive
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="p-0 m-0">
                <Edit />
              </Button>
            </DialogTrigger>
            <PlanFormDialog
              plan={plan}
              closeModal={() => {
                setModalOpen(false);
              }}
            />
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost">
                <Trash />
              </Button>
            </AlertDialogTrigger>
            <PlanDeletionAlertDialog id={plan.id} subscribers={200} />
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

const PlanDeletionAlertDialog: React.FC<{
  subscribers: number;
  id: string;
}> = ({ id, subscribers }) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation<
    ApiResponseWithMessage,
    ApiErrorResponseType,
    string,
    { previousPlans: ApiResponseWithData<SubscriptionPlan[]> }
  >({
    mutationFn: (id: string) => deletePlan(id),
    onMutate(id) {
      const previousPlans: ApiResponseWithData<SubscriptionPlan[]> =
        queryClient.getQueryData(["subscription-plans"])!;
      queryClient.setQueryData(
        ["subscription-plans"],
        produce(previousPlans, (draft) => {
          draft.data.data.splice(
            draft.data.data.findIndex((plan) => plan.id === id),
            1,
          );
        }),
      );
      return { previousPlans };
    },
    onError(error, _variables, context) {
      // Undoing optimistic update on error
      queryClient.setQueryData(["subscription-plans"], context?.previousPlans);

      if (error.response) {
        toast.error(error.response.data.message);
      }
    },
    onSuccess(data) {
      toast.success(data.data.message);
    },
  });

  const handleClick = () => {
    mutate(id);
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure you want to delete this plan?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action will affect {subscribers} users
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleClick}>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

const planFormSchema = createSubscriptionPlanSchema.extend({
  features: z.array(z.object({ value: z.string() })),
});
type PlanFormType = z.infer<typeof planFormSchema>;

const PlanFormDialog: React.FC<{
  plan?: SubscriptionPlan;
  closeModal: () => void;
}> = ({ plan, closeModal }) => {
  const queryClient = useQueryClient();
  const editing = !!plan;

  const form = useForm<PlanFormType>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: plan?.name ?? "",
      description: plan?.description ?? "",
      active: plan?.active ?? true,
      freeWorkshopHours: plan?.freeWorkshopHours ?? 0,
      monthlyPrice: plan?.price.monthly ?? 0,
      yearlyPrice: plan?.price.yearly ?? 0,
      currency: plan?.price.currency ?? "INR",
      features: plan?.features
        ? plan.features.map((feature) => ({ value: feature }))
        : [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const createMutation = useMutation<
    Awaited<ReturnType<typeof createPlan>>,
    ApiErrorResponseType,
    z.infer<typeof createSubscriptionPlanSchema>
  >({
    mutationFn: createPlan,
    onError(error, variables, _context) {
      if (error.response?.data) {
        if (error.response.data.errors) {
          for (const { error: message, field } of error.response.data.errors) {
            if (field)
              form.setError(field as keyof typeof variables, { message });
          }
        }
        if (error.response.data.message) {
          form.setError("root", { message: error.response.data.message });
        }
      }
    },
    onSuccess(data) {
      // Mutating state on success
      const previousPlans: ApiResponseWithData<SubscriptionPlan[]> =
        queryClient.getQueryData(["subscription-plans"])!;
      queryClient.setQueryData(
        ["subscription-plans"],
        produce(previousPlans, (draft) => {
          draft.data.data.push(data.data.data);
        }),
      );
      // if (data.data.message) {
      //   toast.success(data.data.message);
      // }
      // closeModal();
    },
  });

  const editMutation = useMutation<
    Awaited<ReturnType<typeof editPlan>>,
    ApiErrorResponseType,
    { data: z.infer<typeof editSubscriptionPlanSchema>; id: string },
    { previousPlans: ApiResponseWithData<SubscriptionPlan[]> }
  >({
    mutationFn: ({ data, id }) => editPlan(id, data),
    // Optimistic update
    onMutate(variables) {
      const previousPlans: ApiResponseWithData<SubscriptionPlan[]> =
        queryClient.getQueryData(["subscription-plans"])!;
      queryClient.setQueryData(
        ["subscription-plans"],
        produce(previousPlans, (draft) => {
          draft.data.data.forEach((plan) => {
            if (plan.id === variables.id) {
              Object.assign(plan, variables.data);
            }
          });
        }),
      );
      return { previousPlans };
    },
    onError(error, variables, context) {
      // Undoing optimistic update on error
      queryClient.setQueryData(["subscription-plans"], context?.previousPlans);

      // Setting RHF field errors
      if (error.response?.data) {
        if (error.response.data.errors) {
          for (const { error: message, field } of error.response.data.errors) {
            if (field)
              form.setError(field as keyof typeof variables.data, { message });
          }
        }
        if (error.response.data.message) {
          form.setError("root", { message: error.response.data.message });
        }
      }
    },
    // onSuccess(data) {
    //   if (data.data.message) {
    //     toast.success(data.data.message);
    //   }
    //   closeModal();
    // },
  });

  async function onSubmit(values: PlanFormType) {
    // transforming features to request friendly structure
    const features = values.features.map((feature) => feature.value);
    if (editing) {
      editMutation.mutate(
        { id: plan.id, data: { ...values, features } },
        {
          onSuccess(response) {
            if (response.data.message) {
              toast.success(response.data.message);
            }
            closeModal();
          },
        },
      );
    } else {
      createMutation.mutate(
        { ...values, features },
        {
          onSuccess(response) {
            if (response.data.message) {
              toast.success(response.data.message);
            }
            closeModal();
          },
        },
      );
    }
  }

  return (
    <DialogContent className="overflow-scroll max-h-[80%] w-full">
      <DialogHeader>
        <DialogTitle>{editing ? "Edit plan" : "Create New Plan"}</DialogTitle>
        <DialogDescription>
          {editing
            ? "Edit details of subscription plan"
            : "Fill in the details of the new subscription plan"}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan name</FormLabel>
                <FormControl>
                  <Input placeholder="ex: Professional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormDescription>
                  A short description about the plan
                </FormDescription>
                <FormControl>
                  <Input placeholder="ex: best for professionals" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4 items-center">
            <FormField
              name="monthlyPrice"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Per month</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="yearlyPrice"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Per year</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-8 items-center">
            <FormField
              name="freeWorkshopHours"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Free workshop hours</FormLabel>
                  <FormDescription>
                    Number of free workshop hours subscribers can attend
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="active"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      {field.value === true ? (
                        <div className="text-xs">Active</div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          Inactive
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FormLabel>Features</FormLabel>
            {fields.length === 0 ? (
              <FormDescription>No features...</FormDescription>
            ) : (
              fields.map((item, index) => (
                <div className="flex w-full items-center gap-2">
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`features.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="grow-1">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        <X />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove feature</TooltipContent>
                  </Tooltip>
                </div>
              ))
            )}
            <Button
              variant="outline"
              type="button"
              onClick={() => append({ value: "" })}
            >
              Add feature
            </Button>
          </div>
          {/*Non field specific error display*/}
          {form.formState.errors.root && (
            <div className="text-red-500 text-sm">
              {form.formState.errors.root.message}
            </div>
          )}
          <Button type="submit">{plan ? "Upate plan" : "Create plan"}</Button>
        </form>
      </Form>
    </DialogContent>
  );
};
