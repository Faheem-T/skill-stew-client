import type { ChangeEvent, RefObject } from "react";
import { AlertCircle, Check, ImagePlus, Loader2, Upload } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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
import { Textarea } from "@/shared/components/ui/textarea";
import { type WorkshopBasicsFormValues } from "@/features/workshop/schemas";
import { InlineStatus } from "@/features/workshop/components/WorkshopWizardShared";

type WorkshopBasicsFormInstance = UseFormReturn<WorkshopBasicsFormValues>;

export const WorkshopBasicsStep = ({
  form,
  bannerPreview,
  isDraftCreated,
  isPending,
  isUploading,
  fileInputRef,
  onFilePick,
  onFileSelected,
  onUndoFile,
  onSubmit,
  statusMessage,
}: {
  form: WorkshopBasicsFormInstance;
  bannerPreview: string | null;
  isDraftCreated: boolean;
  isPending: boolean;
  isUploading: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFilePick: () => void;
  onFileSelected: (event: ChangeEvent<HTMLInputElement>) => void;
  onUndoFile: () => void;
  onSubmit: (values: WorkshopBasicsFormValues) => Promise<void>;
  statusMessage: string | null;
}) => {
  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold text-foreground">
          Step 1. Basic workshop details
        </CardTitle>
      </CardHeader>
      <CardContent className="border-t border-border/70 pt-6">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workshop title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11"
                          placeholder="Intro to distributed systems"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxCohortSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum cohort size</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          inputMode="numeric"
                          className="h-11"
                          placeholder="20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-32 resize-none"
                          placeholder="Describe the workshop structure, outcomes, and what learners should expect."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target audience</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-24 resize-none"
                          placeholder="Who is this workshop for, and what prior experience is expected?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-dashed border-border bg-secondary/40 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    Banner image
                  </p>
                  <div className="mt-3 overflow-hidden rounded-lg border border-border bg-background">
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="Workshop banner preview"
                        className="h-40 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-muted text-muted-foreground">
                        <div className="space-y-2 text-center">
                          <ImagePlus className="mx-auto h-6 w-6" />
                          <p className="text-sm">No banner selected</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={onFileSelected}
                    />
                    <Button type="button" variant="outline" onClick={onFilePick}>
                      <Upload className="h-4 w-4" />
                      {bannerPreview ? "Replace banner" : "Upload banner"}
                    </Button>
                    {bannerPreview && (
                      <Button type="button" variant="ghost" onClick={onUndoFile}>
                        Remove selection
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {statusMessage && (
              <InlineStatus icon={<Check className="h-4 w-4" />} title="Saved">
                {statusMessage}
              </InlineStatus>
            )}

            {form.formState.errors.root && (
              <InlineStatus
                variant="error"
                icon={<AlertCircle className="h-4 w-4" />}
                title="Unable to save basics"
              >
                {form.formState.errors.root.message}
              </InlineStatus>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-6">
              <Button type="submit" disabled={isPending}>
                {(isPending || isUploading) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {isDraftCreated ? "Save and continue" : "Create draft"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
