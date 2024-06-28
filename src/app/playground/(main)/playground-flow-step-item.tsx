import * as React from "react";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { AlertTriangle, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AccordionContent, AccordionItem } from "~/components/ui/accordion";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import PDDTStep from "~/lib/PDDTStep.ts";
import { cn } from "~/lib/utils";

export default function PlaygroundFlowStepItem({
  step,
  handleOptionChange,
}: {
  step: PDDTStep;
  handleOptionChange: (option: string) => void;
}) {
  if (step.error) {
    return <PlaygroundFlowError />;
  }

  if (step.result) {
    return <PlaygroundFlowResults result={step.result} />;
  }

  if (step.branchData?.final) {
    return (
      <div className={"py-4 flex items-center justify-between"}>
        <p className={"font-medium opacity-40"}>Generating results...</p>
        <Loader2 className={"animate-spin w-4 h-4"} />
      </div>
    );
  }

  const value = step.variables[step.branchData?.variable || ""];

  if (!step.branchData) return null;

  return (
    <AccordionItem value={step.branchData!.variable!} className="w-full">
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={
            "flex flex-1 items-center justify-between py-4 gap-x-8 font-medium transition-all [&[data-state=open]>div>svg]:rotate-180 overflow-hidden w-full"
          }
          disabled={!value}
        >
          <div className={"flex items-center space-x-3"}>
            <span className={cn(!value && "opacity-40")}>
              {!value ? `Evaluating ${step.branchData?.variable}...` : step.branchData?.variable}
            </span>
            {value && <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />}
          </div>
          <div className={"overflow-hidden"}>
            {!value ? (
              <Loader2 className={"animate-spin w-4 h-4"} />
            ) : (
              <p className={"font-normal opacity-50 truncate"}>{value}</p>
            )}
          </div>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      {value && (
        <AccordionContent className="px-4">
          {step.branchData!.options ? (
            <RadioGroup
              value={step.branchData!.options?.find(option => option.name === value)?.id}
              onValueChange={handleOptionChange}
            >
              {step.branchData!.options?.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id}>{option.name}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <p className={"font-normal italic"}>{value}</p>
          )}
        </AccordionContent>
      )}
    </AccordionItem>
  );
}

function PlaygroundFlowResults({ result }: { result: PDDTStep["result"] }) {
  const onCopyResult = (result: string) => {
    navigator.clipboard.writeText(result);

    toast(`Copied "${result}" to clipboard.`, {
      action: {
        label: "OK",
        onClick: () => {},
      },
    });
  };

  return (
    <div>
      <div className={"space-y-4 mt-6"}>
        <p className={"font-medium opacity-50"}>Results:</p>
        {result!.map((text, i) => (
          <button
            key={i}
            className={"border shadow-sm hover:shadow-md transition-all rounded-md py-3 px-4 w-full text-left"}
            onClick={() => onCopyResult(text)}
          >
            <p className={"font-semibold text-lg"}>{text}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function PlaygroundFlowError() {
  return (
    <div className={"py-4 flex bg-red-100 mt-6 rounded-md p-4"}>
      <AlertTriangle className={"text-red-500 w-6 h-6"} />
      <div className={"pl-4 space-y-2"}>
        <p className={"font-medium text-red-800"}>Whoops! An error occurred.</p>
      </div>
    </div>
  );
}
