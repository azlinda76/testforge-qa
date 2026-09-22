import type { GeneratedCase, TestForgeProject } from "@/domain";

import { generateFieldCases } from "./generate-field-cases";

export function generateProjectCases(
  project: TestForgeProject,
): GeneratedCase[] {
  return project.fields.flatMap((field) =>
    generateFieldCases(field, project.options),
  );
}
