"use client";

import { useEffect } from "react";

import useSeedStores from "~/lib/use-seed-stores.ts";

import type loadResources from "./load-resources.ts";

export default function SeedStores({ steps, resources, headPrompt }: Awaited<ReturnType<typeof loadResources>>) {
  const seedStoresFn = useSeedStores();

  useEffect(() => {
    seedStoresFn({ steps, resources, headPrompt });
  }, [steps, resources, headPrompt]);

  return null;
}
