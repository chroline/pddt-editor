"use server";

import Step from "~/lib/Step.ts";
import callRedis from "~/lib/callRedis.ts";

export default async function loadResources() {
  const fetchSteps = async () => {
    const keys: string[] = (await callRedis({ route: "keys/steps:*" })).map((k: string) => k.split("steps:")[1]);
    if (keys.length === 0) return [];

    const pipelineOperations = keys.map(key => ["GET", `steps:${key}`]);

    const results = (await callRedis({
      route: "pipeline",
      body: pipelineOperations,
    })) as { result: string }[];

    return (results || []).map(({ result }, i) => [keys[i], JSON.parse(result)]) as [string, Step][];
  };

  const fetchResources = async () => {
    const keys: string[] = (await callRedis({ route: "keys/resources:*" })).map(
      (k: string) => k.split("resources:")[1]
    );
    if (keys.length === 0) return [];

    const pipelineOperations = keys.map(key => [`GET`, `resources:${key}`]);

    const results = (await callRedis({
      route: "pipeline",
      body: pipelineOperations,
    })) as { result: string }[];

    return results.map(({ result }, i) => [keys[i], JSON.parse(result)]) as [string, string][];
  };

  const fetchHeadPrompt = async () => {
    const result = (await callRedis({ route: `get/head-prompt` })) as string;

    return result ? JSON.parse(result) : "";
  };

  const [steps, resources, headPrompt] = await Promise.all([fetchSteps(), fetchResources(), fetchHeadPrompt()]);

  return { steps, resources, headPrompt };
}
