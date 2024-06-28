import PDDTStep from "~/lib/PDDTStep.ts";

export type GenerateResponsesFunction = (
  clinicalNotes: string,
  paths?: string[],
  variables?: Record<string, string>
) => AsyncGenerator<Partial<PDDTStep>>;
