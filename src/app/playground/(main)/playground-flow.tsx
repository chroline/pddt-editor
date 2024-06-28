import * as React from "react";

import { Accordion } from "~/components/ui/accordion";
import useProcessInput from "~/lib/stores/process-input.ts";

import PlaygroundFlowStepItem from "./playground-flow-step-item.tsx";

export default function PlaygroundFlow({ onUpdate }: { onUpdate: (next: string) => void }) {
  const { steps, setSteps } = useProcessInput();

  function handleOptionChange(i: number, option: string) {
    const oldSteps = steps.slice(0, i);
    const currStep = steps[i];

    const optionObj = currStep.branchData!.options!.find(o => o.id === option)!;

    const newStep = {
      ...currStep,
      variables: {
        ...currStep.variables,
        [currStep.branchData!.variable!]: optionObj.name,
      },
    };

    setSteps([...oldSteps, newStep]);

    onUpdate(optionObj.next!);
  }

  return (
    <Accordion type={"multiple"}>
      {steps.map((_, i) => (
        <PlaygroundFlowStepItem key={i} step={steps[i]} handleOptionChange={(v: string) => handleOptionChange(i, v)} />
      ))}
    </Accordion>
  );
}
