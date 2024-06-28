import { useState } from "react";

import { Plus } from "lucide-react";
import ResourceEditor from "~/components/resource-editor.tsx";
import { Button } from "~/components/ui/button.tsx";
import { Dialog } from "~/components/ui/dialog.tsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "~/components/ui/sheet.tsx";
import useResources from "~/lib/stores/resources.ts";

export default function ResourcesDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const resourcesState = useResources();

  const [resourceId, setResourceId] = useState<string | undefined>(undefined);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side={"left"}>
          <SheetHeader className={"pb-6"}>
            <SheetTitle>Resources</SheetTitle>
          </SheetHeader>
          <div className={"w-full space-y-4"}>
            {Object.keys(resourcesState.data).map(key => {
              return (
                <Button key={key} className={"w-full shadow font-mono"} size={"lg"} onClick={() => setResourceId(key)}>
                  {key}
                </Button>
              );
            })}
            <Button variant={"outline"} className={"w-full text-lg gap-2"} onClick={() => setResourceId("")}>
              <Plus /> Create
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={typeof resourceId !== "undefined"} onOpenChange={() => setResourceId(undefined)}>
        <ResourceEditor id={resourceId} onClose={() => setResourceId(undefined)} />
      </Dialog>
    </>
  );
}
