import { Fragment, useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, TrashIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button.tsx";
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
import { Label } from "~/components/ui/label.tsx";
import { SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "~/components/ui/sheet.tsx";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs.tsx";
import { Textarea } from "~/components/ui/textarea.tsx";
import stepSchema from "~/lib/step-schema.ts";
import useTreeData from "~/lib/stores/tree-data.ts";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface NodeEditorProps {
  id: string | undefined;
  onClose: () => void;
}

const insertionGuides = {
  Standard: {
    input: "Inserts the input text.",
    choices: "Renders step options as choices to the LLM.",
  },
  Additional: {
    "variables.[NAME]": "Provides the value (display name) of the variable.",
    "resources.[NAME]": "Inserts the resource content.",
  },
};

export default function StepEditor({ id, onClose }: NodeEditorProps) {
  const treeDataState = useTreeData();
  const [nodeData, setNodeData] = useState<any | undefined>(undefined);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (typeof id !== "undefined") {
      setNodeData(treeDataState.data[id]);
    }
  }, [id]);

  const form = useForm<z.infer<typeof stepSchema>>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      id: "",
      prompt: "",
      final: false,
      variable: "",
    },
  });
  const optionsField = useFieldArray({
    control: form.control,
    name: "options",
    shouldUnregister: true,
  });
  const isFinal = form.watch("final");
  const options = form.watch("options");

  useEffect(() => {
    if (nodeData) {
      form.reset();
      form.setValue("id", id as string);
      form.setValue("prompt", nodeData!.prompt);
      form.setValue("final", nodeData!.final ?? false);
      form.setValue("variable", nodeData!.variable);
      form.setValue("options", []);
      form.setValue("options", nodeData!.options);
      (nodeData!.options as z.infer<typeof stepSchema>["options"]).forEach((option, i) => {
        form.setValue(`options.${i}.id`, option.id);
        form.setValue(`options.${i}.name`, option.name);
        form.setValue(`options.${i}.next`, option.next);
      });

      if (closeRef.current) {
        closeRef.current.focus();
      }
    }
  }, [nodeData]);

  function onSubmit(values: z.infer<typeof stepSchema>) {
    treeDataState.updateNode(id!, values);
    treeDataState.saveNode(values.id);
    onClose();
  }

  function deleteStep() {
    treeDataState.deleteNode(id as string);
    onClose();
  }

  if (!nodeData) return;

  return (
    <Form {...form}>
      <SheetContent className={"overflow-scroll min-w-2xl !max-w-[unset]"}>
        <SheetClose ref={closeRef} />
        <SheetHeader className={"pb-4"}>
          <SheetTitle>Edit Step</SheetTitle>
        </SheetHeader>
        <form key={id} onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4"}>
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Step ID</FormLabel>
                <FormControl>
                  <Input {...field} disabled={field.value === "index"} />
                </FormControl>
                <FormDescription>This must be a unique identifier.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={"flex relative items-center"}>
                  <span className={"flex-1"}>Prompt</span>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button
                        variant={"link"}
                        type={"button"}
                        className={"h-[unset] py-0 px-0 opacity-70 hover:opacity-100"}
                      >
                        Insertions
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-1" align={"end"}>
                      {Object.entries(insertionGuides).map(([sectionName, guides], i) => (
                        <Fragment key={i}>
                          <p className={"px-2 py-1.5 text-sm font-semibold"}>{sectionName}</p>
                          <div>
                            {Object.entries(guides).map(([guideName, guide], i) => (
                              <div key={i} className={"px-2 py-1.5"}>
                                <p className={"text-sm font-mono"}>{`{{ ${guideName} }}`}</p>
                                <p className={"font-medium opacity-70 text-xs"}>{guide}</p>
                              </div>
                            ))}
                          </div>
                          {i !== Object.entries(insertionGuides).length - 1 && (
                            <hr className={"-mx-1 my-1 h-px bg-muted"} />
                          )}
                        </Fragment>
                      ))}
                    </HoverCardContent>
                  </HoverCard>
                </FormLabel>
                <FormControl>
                  <Textarea className={"min-h-96"} {...field} />
                </FormControl>
                <FormDescription>Head prompt will automatically be prepended to your prompt.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="final"
            render={({ field }) => (
              <Tabs
                value={String(field.value)}
                onValueChange={v => {
                  field.onChange(v === "true");
                }}
                className="w-full"
              >
                <TabsList className={"w-full"}>
                  <TabsTrigger value={"false"}>Intermediate Step</TabsTrigger>
                  <TabsTrigger value={"true"}>Final Step</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          />
          {!isFinal && (
            <>
              <FormField
                control={form.control}
                name="variable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Step Variable</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={"space-y-2"}>
                <Label>Options</Label>
                <div className={"grid md:grid-cols-2 md:gap-3 gap-2"}>
                  {options.map((_, index) => (
                    <div
                      key={`${id}-${index}`}
                      className={"rounded-md border-2 border-dashed p-3 space-y-2 bg-gray-50"}
                    >
                      <FormField
                        key={`${id}-${index}-id`}
                        control={form.control}
                        name={`options.${index}.id`}
                        render={({ field }) => (
                          <FormItem key={`${id}-${index}-id-item`}>
                            <FormLabel>Option ID</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        key={`${id}-${index}-name`}
                        control={form.control}
                        name={`options.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Option Display Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        key={`${id}-${index}-next`}
                        control={form.control}
                        name={`options.${index}.next`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Option Next ID</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>Where the option links to.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        variant={"destructive"}
                        size={"xs"}
                        className={"float-right"}
                        onClick={() => {
                          optionsField.remove(index);
                        }}
                      >
                        <TrashIcon className={"mr-2 w-4"} />
                        Delete
                      </Button>
                    </div>
                  ))}
                  <div className={"flex items-center justify-center border-2 border-dashed rounded-md py-8 px-4"}>
                    <Button
                      className={"gap-2"}
                      onClick={() => {
                        optionsField.append({
                          id: "",
                          name: "",
                          next: "",
                        });
                      }}
                    >
                      <Plus />
                      Add Option
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
          <SheetFooter>
            <Button type="submit" size={"lg"} className={"w-full text-lg gap-2"}>
              <Save />
              Save Step
            </Button>
            <Button
              type={"button"}
              onClick={deleteStep}
              variant={"destructive"}
              size={"lg"}
              className={"w-full text-lg gap-2"}
            >
              <TrashIcon />
              Delete Step
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Form>
  );
}
