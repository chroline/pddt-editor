import Step from "~/lib/Step";
import callRedis from "~/lib/callRedis.ts";
import { GenerateResponsesFunction } from "~/lib/generate-responses-function.ts";

export const generateResponses: GenerateResponsesFunction = async function* (
  clinicalNotes: string,
  paths: string[] = [],
  variables: Record<string, string> = {}
) {
  try {
    yield { paths, variables };

    const basePrompt = (await callRedis({ route: `get/head-prompt` }))?.basePrompt ?? "";

    const step = await loadStep(paths[paths.length - 1] ?? "index");
    let newPrompt = step.prompt;

    const branchData: Omit<Step, "prompt"> = step;
    // @ts-expect-error allow prompt key
    delete branchData.prompt;

    yield { branchData };

    const insertions = newPrompt.match(/{{(.*?)}}/g) || [];
    await Promise.all(
      insertions.map(async (insertion: string) => {
        const toInsert = await getInsertionContent(insertion, variables, clinicalNotes, branchData);
        newPrompt = newPrompt.replace(new RegExp(insertion, "g"), toInsert);
      })
    );

    const fullPrompt = basePrompt + "\n\n" + newPrompt;
    console.log({ fullPrompt });
    const rawAnswer = await getAIResponse(fullPrompt);
    console.log(rawAnswer);

    // if answer is array, end processing.
    if (Array.isArray(rawAnswer)) {
      yield {
        result: rawAnswer as string[],
      };

      return;
    }

    // otherwise, update variables
    const answer: string = Array.isArray(rawAnswer) ? rawAnswer[0] : rawAnswer;

    const newVariables = updateVariables(variables, branchData.variable!, rawAnswer, branchData.options!);
    const nextPath = getNextPath(answer, branchData.options!);
    yield* generateResponses(clinicalNotes, [...paths, nextPath], newVariables);
  } catch (e) {
    console.error(e);
    yield { error: true };
  }
};

async function loadStep(id: string): Promise<Step> {
  const res = await callRedis({ route: `get/steps:${id}` });
  console.log({ res, id });
  return JSON.parse(res);
}

async function getInsertionContent(
  insertion: string,
  variables: Record<string, string>,
  clinicalNotes: string,
  branchData: any
): Promise<string> {
  const insertionPaths = insertion.replace(/{|}/g, "").split(".");
  switch (insertionPaths[0]) {
    case "resources":
      return await callRedis({ route: `get/resources:${insertionPaths[1]}` });
    case "variables":
      return variables[insertionPaths[1]] ?? "N/A";
    case "input":
      return `Below is the input:\n\n"${clinicalNotes}"`;
    case "choices":
      // eslint-disable-next-line no-case-declarations
      const choices = "- " + branchData["options"].map((option: { id: string }) => `"${option.id}"`).join("\n- ");
      return `Print one of the following options (with quotes):\n\n${choices}`;
    default:
      return "";
  }
}

async function getAIResponse(fullPrompt: string): Promise<any> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-0125",
      temperature: 0,
      messages: [{ role: "system", content: fullPrompt }],
    }),
  });
  const jsonResponse = await response.json();
  console.log(jsonResponse.choices);
  return JSON.parse(jsonResponse.choices[0].message.content.split("\n").pop());
}

function updateVariables(
  variables: Record<string, string>,
  variableName: string,
  id: string,
  options: { id: string; name: string }[]
): Record<string, string> {
  return {
    ...variables,
    [variableName]: options.find(option => option.id === id)?.name || "",
  };
}

function getNextPath(answer: string, options: { id: string; next: string }[]): string {
  return options.find(option => option.id === answer)?.next || "";
}
