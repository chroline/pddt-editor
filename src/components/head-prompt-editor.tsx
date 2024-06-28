import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form.tsx";
import { SheetFooter } from "~/components/ui/sheet.tsx";
import { Textarea } from "~/components/ui/textarea.tsx";
import useHeadPrompt from "~/lib/stores/head-prompt.ts";

const formSchema = z.object({
  content: z.string().min(1),
});

export default function HeadPromptEditor({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const headPromptState = useHeadPrompt();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: headPromptState.content,
    },
  });

  useEffect(() => {
    form.setValue("content", headPromptState.content);
  }, [headPromptState.content]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    headPromptState.update(values.content);
    headPromptState.save();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Head Prompt</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4"}>
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
                Save
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
