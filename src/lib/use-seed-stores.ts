import { useCallback } from "react";

import type loadResources from "~/app/editor/load-resources.ts";
import useHeadPrompt from "~/lib/stores/head-prompt.ts";
import useResources from "~/lib/stores/resources.ts";
import useTreeData from "~/lib/stores/tree-data.ts";

export default function useSeedStores() {
  const treeDataState = useTreeData();
  const resourcesState = useResources();
  const headPromptState = useHeadPrompt();

  const fn = useCallback(
    ({ steps, resources, headPrompt }: Awaited<ReturnType<typeof loadResources>>, save: boolean = false) => {
      // load steps
      if (steps.length > 0) {
        steps.forEach(([key, result]) => {
          treeDataState.updateNode(key, { id: "index", ...result });
          save && treeDataState.saveNode(key);
        });
      } else {
        // initialize tree if empty
        treeDataState.updateNode("index", {
          id: "index",
          prompt: "",
          options: [],
        });
        treeDataState.saveNode("index");
      }

      // load resources
      resources.forEach(([key, result]) => {
        resourcesState.updateResource(key, result);
        save && resourcesState.saveResource(key);
      });

      // load head prompt
      headPromptState.update(headPrompt);
      save && headPromptState.save();
    },
    [treeDataState, headPromptState, resourcesState]
  );

  return fn;
}
