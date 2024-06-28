"use server";

import Step from "~/lib/Step.ts";
import callRedis from "~/lib/callRedis.ts";

export async function saveStep(id: string, step: Step) {
  await callRedis({ route: `set/steps:${id}`, body: step });
}

export async function deleteStep(id: string) {
  await callRedis({ route: `del/steps:${id}` });
}

export async function saveHeadPrompt(text: string) {
  await callRedis({ route: `set/head-prompt`, body: text });
}

export async function saveResource(id: string, body: string) {
  await callRedis({ route: `set/resources:${id}`, body });
}

export async function reset() {
  await callRedis({ route: "flushall" });
}
