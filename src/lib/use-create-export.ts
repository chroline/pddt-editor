import { useCallback } from "react";

import useHeadPrompt from "~/lib/stores/head-prompt.ts";
import useResources from "~/lib/stores/resources.ts";
import useTreeData from "~/lib/stores/tree-data.ts";

export default function useCreateExport() {
  const resourcesState = useResources();
  const treeDataState = useTreeData();
  const headPromptState = useHeadPrompt();

  const fn = useCallback(() => {
    const headPromptExport = JSON.stringify({ type: "headPrompt", data: headPromptState.content });
    const resourcesExport = Object.values(resourcesState.data).reduce(
      (prev, data) => prev + JSON.stringify({ type: "resource", data }) + "\n",
      ""
    );
    const treeDataExport = Object.values(treeDataState.data).reduce(
      (prev, data) => prev + JSON.stringify({ type: "step", data }) + "\n",
      ""
    );
    return headPromptExport + resourcesExport + "\n" + treeDataExport;
  }, [resourcesState, treeDataState, headPromptState]);

  return fn;
}
