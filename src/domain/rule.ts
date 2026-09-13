import type { PrimitiveValue } from "./field";

export type RuleOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "empty"
  | "not-empty";

export type RuleOutcomeOperator = "eq" | "neq" | "available" | "unavailable";

export interface RuleCondition {
  fieldId: string;

  operator: RuleOperator;

  value?: PrimitiveValue;
}

export interface RuleOutcome {
  fieldId: string;

  operator: RuleOutcomeOperator;

  value?: PrimitiveValue;
}

export interface BusinessRule {
  id: string;

  name: string;

  /**
   * MVP supports maximum 3 conditions.
   */
  conditions: RuleCondition[];

  outcome: RuleOutcome;

  description?: string;
}

export interface RuleEvaluation {
  ruleId: string;

  triggered: boolean;

  outcomeSatisfied?: boolean;

  reason: string;
}
