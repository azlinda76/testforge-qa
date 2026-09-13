export type TestCategory =
  | "valid"
  | "boundary"
  | "negative"
  | "special"
  | "business-rule";

export type ExpectedValidity = "valid" | "invalid" | "conditional";

export interface GeneratedCase {
  id: string;

  fieldId?: string;
  fieldName?: string;

  /**
   * Used by single-field generated test cases.
   */
  value?: unknown;

  /**
   * Used by multi-field / business-rule scenarios.
   */
  values?: Record<string, unknown>;

  category: TestCategory;

  expected: ExpectedValidity;

  /**
   * Human-readable explanation of why this
   * test case was generated.
   */
  reason: string;

  /**
   * Example:
   * "minLength=5"
   * "max=500"
   */
  sourceConstraint?: string;

  /**
   * Used by generated business-rule scenarios.
   */
  sourceRuleId?: string;
}
