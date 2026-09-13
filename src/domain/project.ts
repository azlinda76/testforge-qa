import type { TestField } from "./field";
import type { GeneratorOptions } from "./generator-options";
import type { BusinessRule } from "./rule";

export interface TestForgeProject {
  version: 1;

  id: string;

  name: string;

  fields: TestField[];

  rules: BusinessRule[];

  options: GeneratorOptions;
}
