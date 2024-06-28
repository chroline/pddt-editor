import Step from "~/lib/Step";

export default interface PDDTStep {
  paths: string[];
  variables: Record<string, string>;
  error?: boolean;
  branchData?: Omit<Step, "prompt">;
  result?: string[];
}
