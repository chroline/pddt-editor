import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button.tsx";
import { DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog.tsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form.tsx";
import { Input } from "~/components/ui/input.tsx";
import { SheetFooter } from "~/components/ui/sheet.tsx";
import { Textarea } from "~/components/ui/textarea.tsx";
import useResources from "~/lib/stores/resources.ts";

const formSchema = z.object({
  id: z.string().min(1),
  content: z.string().min(1),
});

export default function ResourceEditor({ id, onClose }: { id: string | undefined; onClose: () => void }) {
  const resourcesState = useResources();
  const [resource, setResource] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof id !== "undefined") {
      setResource(resourcesState.data[id]);
    }
  }, [id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      content: "",
    },
  });

  useEffect(() => {
    form.setValue("id", id || "");
    form.setValue("content", resource || "");
  }, [resource]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    resourcesState.updateResource(values.id, values.content);
    resourcesState.saveResource(values.id);
    onClose();
  }

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resource</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4"}>
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource ID</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly={!!id} />
                  </FormControl>
                  <FormDescription>This must be a unique identifier.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea className={"h-64"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit" size={"lg"} className={"w-full text-lg gap-2"}>
                <Save />
                Save Resource
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </DialogContent>
    </>
  );
}
