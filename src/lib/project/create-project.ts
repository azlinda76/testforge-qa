import { DEFAULT_GENERATOR_OPTIONS, type TestForgeProject } from "@/domain";

export function createEmptyProject(): TestForgeProject {
  return {
    version: 1,
    id: crypto.randomUUID(),
    name: "Untitled TestForge Project",
    fields: [],
    rules: [],
    options: {
      ...DEFAULT_GENERATOR_OPTIONS,
    },
  };
}
