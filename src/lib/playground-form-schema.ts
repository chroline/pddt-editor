import { z } from "zod";

export const playgroundFormSchema = z.object({
  input: z.string().min(1, "Input is required."),
});
