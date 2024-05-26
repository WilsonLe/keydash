import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useForm, useFormState, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const FormSchema = z.object({
  title: z.string().min(3),
  url: z.string().url(),
  icon: z.string().url().optional(),
});

type FormSchema = z.infer<typeof FormSchema>;

export const AddBookmarkDialog: FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  baseKey: "Ctrl" | "⌘" | null;
}> = ({ open, setOpen, baseKey }) => {
  const [creating, setCreating] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: async () =>
      JSON.parse(localStorage.getItem("keydash") ?? "{}"),
  });
  const formValue = useWatch({
    control: form.control,
  });
  const formState = useFormState({ control: form.control });
  useEffect(() => {
    localStorage.setItem("keydash", JSON.stringify(formValue));
  }, [formValue]);

  const onSubmit = async (values: FormSchema) => {
    setCreating(true);
    setSubmitSuccess(false);
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      if (response.status !== 201) {
        toast.error("Fail to create bookmark", {
          description: (await response.json()).message,
        });
        return;
      }
      setSubmitSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Failed to create bookmark", {
          description: error.message,
        });
        return;
      }
      toast.error("Failed to create bookmark", {
        description: `An unknown error occurred: ${JSON.stringify(error)}`,
      });
    } finally {
      setCreating(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (submitSuccess) {
      form.reset();
      localStorage.removeItem("keydash");
      toast("Bookmark created", {
        description: "Bookmark has been created successfully",
      });
    }
  }, [submitSuccess, form]);

  return (
    <Dialog open={open}>
      <DialogContent
        onClickClose={() => setOpen(false)}
        onClickOutside={() => setOpen(false)}
        onEscape={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Create Bookmark</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-4">
                    <FormLabel className="text-left">Title</FormLabel>
                    <TooltipProvider>
                      <Tooltip open={!!formState.errors.title}>
                        <TooltipTrigger asChild>
                          <FormControl>
                            <Input {...field} className="col-span-5" />
                          </FormControl>
                        </TooltipTrigger>
                        <TooltipContent>
                          <FormMessage />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-4">
                    <FormLabel className="text-left">URL</FormLabel>
                    <TooltipProvider>
                      <Tooltip open={!!formState.errors.url}>
                        <TooltipTrigger asChild>
                          <FormControl>
                            <Textarea {...field} className="col-span-5" />
                          </FormControl>
                        </TooltipTrigger>
                        <TooltipContent>
                          <FormMessage />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-4">
                    <TooltipProvider>
                      <FormLabel className="text-left">Icon</FormLabel>
                      <Tooltip open={!!formState.errors.icon}>
                        <TooltipTrigger asChild>
                          <FormControl>
                            <Textarea
                              {...field}
                              className={cn(
                                field.value && field.value.startsWith("http")
                                  ? "col-span-4"
                                  : "col-span-5",
                              )}
                            />
                          </FormControl>
                        </TooltipTrigger>
                        <TooltipContent>
                          <FormMessage />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {field.value && field.value.startsWith("http") && (
                      <Image
                        alt="Bookmark icon"
                        src={field.value}
                        className="col-span-1 rounded-lg"
                        width={48}
                        height={48}
                      />
                    )}
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <div className="flex flex-row items-center">
            <Button
              disabled={creating}
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              Add
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
