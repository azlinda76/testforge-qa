import { z } from "zod";

import { testFieldSchema } from "./field.schema";
import { businessRuleSchema } from "./rule.schema";

export const generatorOptionsSchema = z.object({
  includeValid: z.boolean(),
  includeBoundary: z.boolean(),
  includeNegative: z.boolean(),
  includeSpecial: z.boolean(),
  includeNull: z.boolean(),
  includeEmpty: z.boolean(),
  includeWhitespace: z.boolean(),
  includeWrongType: z.boolean(),
  includeUnicode: z.boolean(),
});

export const testForgeProjectSchema = z
  .object({
    version: z.literal(1),
    id: z.string().min(1, "Project ID is required"),
    name: z.string().trim().min(1, "Project name is required"),
    fields: z.array(testFieldSchema),
    rules: z.array(businessRuleSchema),
    options: generatorOptionsSchema,
  })
  .superRefine((project, ctx) => {
    const fieldIds = new Set(project.fields.map((field) => field.id));

    for (const rule of project.rules) {
      for (const condition of rule.conditions) {
        if (!fieldIds.has(condition.fieldId)) {
          ctx.addIssue({
            code: "custom",
            message: `Rule "${rule.name}" references unknown field "${condition.fieldId}"`,
            path: ["rules"],
          });
        }
      }

      if (!fieldIds.has(rule.outcome.fieldId)) {
        ctx.addIssue({
          code: "custom",
          message: `Rule "${rule.name}" references unknown outcome field "${rule.outcome.fieldId}"`,
          path: ["rules"],
        });
      }
    }
  });

export type ValidatedTestForgeProject = z.infer<typeof testForgeProjectSchema>;
