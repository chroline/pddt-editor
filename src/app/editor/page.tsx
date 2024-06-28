"use server";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import "reactflow/dist/base.css";
import FlowComponent from "~/components/flow-component.tsx";
import { Button } from "~/components/ui/button.tsx";

import AppMenu from "./app-menu.tsx";
import loadResources from "./load-resources.ts";
import "./main.scss";
import SeedStores from "./seed-stores.ts";

export default async function Page() {
  const data = await loadResources();

  return (
    <>
      <SeedStores {...data} />

      <div className={"fixed z-50 top-0 w-full p-6 flex justify-between items-center backdrop-blur-[2px]"}>
        <AppMenu />
        <h1 className={"absolute left-[50%] -translate-x-[50%] font-medium font-heading text-2xl"}>PDDT Editor</h1>
        <Link target={"_blank"} href={"/playground"}>
          <Button className={"flex gap-2 shadow-md"}>
            Playground <ExternalLink className={"w-5 h-5"} />
          </Button>
        </Link>
      </div>

      <FlowComponent />
    </>
  );
}
