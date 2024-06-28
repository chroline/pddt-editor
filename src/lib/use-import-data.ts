import { useCallback } from "react";

import Step from "~/lib/Step.ts";
import { reset } from "~/lib/actions.ts";
import useSeedStores from "~/lib/use-seed-stores.ts";

export default function useImportData() {
  const seedStores = useSeedStores();

  const fn = useCallback((data: string) => {
    const steps: [string, Step][] = [];
    const resources: [string, string][] = [];
    let headPrompt = "";
    data
      .trim()
      .split("\n")
      .map(v => JSON.parse(v))
      .forEach(item => {
        switch (item.type) {
          case "step":
            steps.push([item.data.id, item.data]);
            break;
          case "resources":
            resources.push([item.data.id, item.data]);
            break;
          case "headPrompt":
            headPrompt = item.data;
            break;
        }
      });

    console.log({ headPrompt });

    reset().finally(() => {
      seedStores({ steps, resources, headPrompt }, true);
    });
  }, []);

  return fn;
}
