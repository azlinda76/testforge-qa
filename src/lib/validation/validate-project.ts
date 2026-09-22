import type { TestForgeProject } from "@/domain";

import { testForgeProjectSchema } from "./project.schema";

export interface ValidationResult {
  success: boolean;
  data?: TestForgeProject;
  errors: string[];
}

export function validateProject(input: unknown): ValidationResult {
  const result = testForgeProjectSchema.safeParse(input);

  if (result.success) {
    return {
      success: true,
      data: result.data as TestForgeProject,
      errors: [],
    };
  }

  return {
    success: false,
    errors: result.error.issues.map((issue) => issue.message),
  };
}
