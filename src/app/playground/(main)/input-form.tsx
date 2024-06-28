"use client";

import * as React from "react";

import { Wand2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button.tsx";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { playgroundFormSchema } from "~/lib/playground-form-schema.ts";

export default function InputForm({
  form,
  onSubmit,
  loading,
}: {
  form: UseFormReturn<z.infer<typeof playgroundFormSchema>>;
  onSubmit: (values: z.infer<typeof playgroundFormSchema>) => Promise<void>;
  loading: boolean;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 flex flex-col">
        <FormField
          control={form.control}
          name={"input"}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Input</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[15rem]"
                  placeholder="Paste in freeform text..."
                  style={{ resize: "none" }}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription className="opacity-70">
                Don&apos;t worry about formatting—we&apos;ll handle it from here.
              </FormDescription>
              <FormMessage className="text-red-500 text-xs" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>Processing...</>
          ) : (
            <>
              <div className="w-4 mr-2">
                <Wand2 style={{ width: "100%", height: "100%" }} />
              </div>
              Process
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
