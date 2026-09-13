import { z } from "zod";

const baseFieldSchema = z.object({
  id: z.string().min(1, "Field ID is required"),
  name: z.string().trim().min(1, "Field name is required"),
  label: z.string().trim().min(1).optional(),
  required: z.boolean(),
});

const stringConstraintsSchema = z
  .object({
    minLength: z.number().int().nonnegative().optional(),
    maxLength: z.number().int().nonnegative().optional(),
    allowSpaces: z.boolean().optional(),
    allowSpecialCharacters: z.boolean().optional(),
    allowUnicode: z.boolean().optional(),
  })
  .refine(
    (value) =>
      value.minLength === undefined ||
      value.maxLength === undefined ||
      value.minLength <= value.maxLength,
    {
      message: "Minimum length cannot be greater than maximum length",
      path: ["minLength"],
    },
  );

const numberConstraintsSchema = z
  .object({
    min: z.number().finite().optional(),
    max: z.number().finite().optional(),
  })
  .refine(
    (value) =>
      value.min === undefined ||
      value.max === undefined ||
      value.min <= value.max,
    {
      message: "Minimum value cannot be greater than maximum value",
      path: ["min"],
    },
  );

const decimalConstraintsSchema = z
  .object({
    min: z.number().finite().optional(),
    max: z.number().finite().optional(),
    decimalPlaces: z.number().int().min(0).max(10).default(2),
  })
  .refine(
    (value) =>
      value.min === undefined ||
      value.max === undefined ||
      value.min <= value.max,
    {
      message: "Minimum value cannot be greater than maximum value",
      path: ["min"],
    },
  );

const primitiveValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

const enumConstraintsSchema = z.object({
  allowedValues: z
    .array(primitiveValueSchema)
    .min(1, "Enum must contain at least one allowed value"),
});

const booleanConstraintsSchema = z.object({});

export const stringFieldSchema = baseFieldSchema.extend({
  type: z.literal("string"),
  constraints: stringConstraintsSchema,
});

export const integerFieldSchema = baseFieldSchema.extend({
  type: z.literal("integer"),
  constraints: numberConstraintsSchema,
});

export const decimalFieldSchema = baseFieldSchema.extend({
  type: z.literal("decimal"),
  constraints: decimalConstraintsSchema,
});

export const enumFieldSchema = baseFieldSchema.extend({
  type: z.literal("enum"),
  constraints: enumConstraintsSchema,
});

export const booleanFieldSchema = baseFieldSchema.extend({
  type: z.literal("boolean"),
  constraints: booleanConstraintsSchema,
});

export const testFieldSchema = z.discriminatedUnion("type", [
  stringFieldSchema,
  integerFieldSchema,
  decimalFieldSchema,
  enumFieldSchema,
  booleanFieldSchema,
]);

export type ValidatedTestField = z.infer<typeof testFieldSchema>;
