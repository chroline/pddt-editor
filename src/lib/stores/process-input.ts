import { z } from "zod";
import { create } from "zustand";
import PDDTStep from "~/lib/PDDTStep.ts";
import { playgroundFormSchema } from "~/lib/playground-form-schema.ts";

const useProcessInput = create<{
  steps: PDDTStep[];
  setSteps: (steps: PDDTStep[]) => void;
  isProcessing: boolean;
  submit: (data: z.infer<typeof playgroundFormSchema>, withState?: boolean, next?: string) => Promise<void>;
}>((set, get) => ({
  steps: [],
  setSteps(steps: PDDTStep[]) {
    set({ steps });
  },

  isProcessing: false,

  async submit(data: z.infer<typeof playgroundFormSchema>, withState: boolean = false, next?: string) {
    set({ isProcessing: true });

    if (!withState) set({ steps: [] });

    const lastStep = [...get().steps].pop();

    const response = await fetch("/api/process", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        paths: lastStep?.paths && [...lastStep.paths, next],
        variables: lastStep?.variables,
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const reader = response.body!.getReader();
    const decoder = new TextDecoder("utf-8");

    let currentData: any = undefined;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();

      // If we're done reading, break out of the loop
      if (done) {
        break;
      }

      const splitString = (input: string) => {
        const matches = [];
        let count = 0;
        let start = -1;
        for (let i = 0; i < input.length; i++) {
          if (input[i] === "{") {
            if (count === 0) {
              start = i;
            }
            count++;
          } else if (input[i] === "}") {
            count--;
            if (count === 0) {
              matches.push(input.substring(start, i + 1));
            }
          }
        }
        return matches;
      };

      splitString(decoder.decode(value)).forEach(value => {
        const newData = JSON.parse(value) as PDDTStep;

        if (typeof newData.paths !== "undefined") {
          currentData = newData;
          if (get().steps.length > 0) {
            set(state => {
              const lastStep = state.steps.pop()!;
              lastStep.variables = newData.variables;
              return { steps: [...state.steps, lastStep] };
            });
          }
        } else if (typeof newData.result !== "undefined") {
          set(state => {
            const lastStep = state.steps.pop()!;
            return { steps: [...state.steps, { ...lastStep, ...newData }] };
          });
        } else {
          set(state => ({
            steps: [...state.steps, { ...currentData, ...newData }],
          }));
        }
      });
    }

    set({ isProcessing: false });
  },
}));

export default useProcessInput;
