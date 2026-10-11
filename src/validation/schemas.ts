import { z } from "zod";

export const moduleInput = z.object({
  name: z.string().min(1),
  code: z.string().min(2),
  lecturer: z.string().min(1),
  semester: z.number().int().min(1).max(2),
});

export const taskInput = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  dueDate: z.coerce.date(),                      // turns "2026-11-01" into a real date
  priority: z.enum(["low", "medium", "high"]),
  completed: z.boolean().default(false),
  module: z.string().regex(/^[0-9a-fA-F]{24}$/), // must look like a Mongo id
});