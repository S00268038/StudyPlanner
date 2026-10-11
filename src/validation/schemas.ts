import { z } from "zod";

export const moduleInput = z.object({
  name: z.string().min(1),
  code: z.string().min(2),
  lecturer: z.string().min(1),
  semester: z.number().int().min(1).max(2),
});