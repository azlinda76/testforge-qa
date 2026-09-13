import { z } from "zod";

const primitiveValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

export const ruleOperatorSchema = z.enum([
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "contains",
  "empty",
  "not-empty",
]);

export const ruleOutcomeOperatorSchema = z.enum([
  "eq",
  "neq",
  "available",
  "unavailable",
]);

export const ruleConditionSchema = z.object({
  fieldId: z.string().min(1, "Condition field is required"),
  operator: ruleOperatorSchema,
  value: primitiveValueSchema.optional(),
});

export const ruleOutcomeSchema = z.object({
  fieldId: z.string().min(1, "Outcome field is required"),
  operator: ruleOutcomeOperatorSchema,
  value: primitiveValueSchema.optional(),
});

export const businessRuleSchema = z.object({
  id: z.string().min(1, "Rule ID is required"),
  name: z.string().trim().min(1, "Rule name is required"),
  description: z.string().trim().optional(),
  conditions: z
    .array(ruleConditionSchema)
    .min(1, "Rule must contain at least one condition")
    .max(3, "MVP supports a maximum of 3 conditions per rule"),
  outcome: ruleOutcomeSchema,
});

export type ValidatedBusinessRule = z.infer<typeof businessRuleSchema>;
