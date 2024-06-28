"use client";

import { useRef, useState } from "react";

import { Download, Menu, RefreshCw, Upload } from "lucide-react";
import HeadPromptEditor from "~/components/head-prompt-editor";
import ResourcesDrawer from "~/components/resources-drawer";
import { Button } from "~/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu.tsx";
import { reset } from "~/lib/actions.ts";
import useCreateExport from "~/lib/use-create-export.ts";
import useImportData from "~/lib/use-import-data.ts";

export default function AppMenu() {
  const [isResourcesDrawerOpen, setIsResourcesDrawerOpen] = useState(false);
  const [isHeadPromptEditorOpen, setIsHeadPromptEditorOpen] = useState(false);

  const createExport = useCreateExport();

  function exportData() {
    const data = createExport();
    const blob = new Blob([data], { type: "application/jsonl" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "export.jsonl";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  async function handleReset() {
    if (confirm("Are you sure you want to reset the editor? This is irreversible.")) {
      await reset();
      location.reload();
    }
  }

  const importFn = useImportData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImportFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const fileContent = await file.text();
      importFn(fileContent);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={"flex gap-2 shadow-md"}>
            <Menu className={"w-5 h-5"} /> Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={"start"} className={"w-56"}>
          <DropdownMenuItem className={"text-md"} onClick={() => setIsHeadPromptEditorOpen(true)}>
            Head Prompt
          </DropdownMenuItem>
          <DropdownMenuItem className={"text-md"} onClick={() => setIsResourcesDrawerOpen(true)}>
            Resources
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className={"text-md flex items-center gap-2"} onClick={() => fileInputRef.current?.click()}>
            <Upload className={"w-5 h-5"} />
            Import
          </DropdownMenuItem>
          <DropdownMenuItem className={"text-md flex items-center gap-2"} onClick={exportData}>
            <Download className={"w-5 h-5"} />
            Export
          </DropdownMenuItem>
          <DropdownMenuItem className={"text-md flex items-center gap-2 !text-red-500"} onClick={handleReset}>
            <RefreshCw className={"w-5 h-5"} />
            Reset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResourcesDrawer isOpen={isResourcesDrawerOpen} onClose={() => setIsResourcesDrawerOpen(false)} />
      <HeadPromptEditor isOpen={isHeadPromptEditorOpen} onClose={() => setIsHeadPromptEditorOpen(false)} />

      <input
        type="file"
        accept=".jsonl"
        onChange={handleImportFile}
        style={{ display: "none" }}
        id="file-upload"
        ref={fileInputRef}
      />
    </>
  );
}
