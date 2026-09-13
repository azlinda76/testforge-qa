export type FieldType = "string" | "integer" | "decimal" | "enum" | "boolean";

export type PrimitiveValue = string | number | boolean | null;

export interface FieldConstraints {
  min?: number;
  max?: number;

  minLength?: number;
  maxLength?: number;

  decimalPlaces?: number;

  allowedValues?: PrimitiveValue[];

  allowSpaces?: boolean;
  allowSpecialCharacters?: boolean;
  allowUnicode?: boolean;
}

export interface TestField {
  id: string;
  name: string;
  label?: string;

  type: FieldType;

  required: boolean;

  constraints: FieldConstraints;
}
