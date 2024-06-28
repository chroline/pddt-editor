import { z } from "zod";

const stepSchema = z.object({
  id: z.string().min(1, "ID is required."),
  prompt: z.string().min(1, "Prompt is required."),
  final: z.boolean(),
  variable: z.string().optional(),
  options: z.array(
    z.object({
      id: z.string().min(1, "Required."),
      name: z.string().min(1, "Required."),
      next: z.string().min(1, "Required."),
    })
  ),
});

export default stepSchema;
