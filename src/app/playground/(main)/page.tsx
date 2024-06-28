"use client";

import * as React from "react";
import { useEffect, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button.tsx";
import { Separator } from "~/components/ui/separator";
import { playgroundFormSchema } from "~/lib/playground-form-schema";
import useProcessInput from "~/lib/stores/process-input";

import InputForm from "./input-form.tsx";
import PlaygroundFlow from "./playground-flow.tsx";

export default function DashboardPage() {
  const form = useForm<z.infer<typeof playgroundFormSchema>>({
    resolver: zodResolver(playgroundFormSchema),
  });

  const { steps, isProcessing, submit } = useProcessInput();

  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Function to scroll to the bottom
    const scrollToBottom = () => {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Check if the user is near the bottom of the page
    const isUserAtBottom = (threshold = 200) => {
      const distanceFromBottom = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
      return distanceFromBottom < threshold;
    };

    if (isUserAtBottom() || steps.length <= 1) {
      console.log("bottom");
      scrollToBottom();
    }
  }, [steps.length, isProcessing, endOfMessagesRef]); // Dependency array includes messages, so this effect runs every time messages change

  return (
    <div className={"w-full flex justify-start flex-col items-center"}>
      <div className={"flex w-full p-6 left-0 top-0 items-center"}>
        <Link target={"_blank"} href={"/editor"}>
          <Button className={"flex gap-2"} variant={"link"}>
            <Pencil className={"w-5 h-5"} /> Editor
          </Button>
        </Link>
        <h1 className={"font-medium font-heading text-2xl text-center absolute left-[50%] -translate-x-[50%]"}>
          PDDT Playground
        </h1>
      </div>

      <div className="w-full max-w-4xl">
        <div className="w-full flex-grow flex flex-col items-center h-full space-y-16">
          <div className="w-full max-w-2xl flex flex-col">
            <InputForm form={form} onSubmit={data => submit(data, false)} loading={isProcessing} />
          </div>
          {steps.length > 0 && (
            <>
              <Separator className={"border-[1px]"} />
              <div className="w-full max-w-2xl pb-16">
                <PlaygroundFlow onUpdate={next => submit(form.getValues(), true, next)} />
              </div>
            </>
          )}
        </div>
      </div>
      <div id={"end"} ref={endOfMessagesRef} />
    </div>
  );
}
