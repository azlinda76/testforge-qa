export interface GeneratorOptions {
  includeValid: boolean;
  includeBoundary: boolean;
  includeNegative: boolean;
  includeSpecial: boolean;

  includeNull: boolean;
  includeEmpty: boolean;
  includeWhitespace: boolean;
  includeWrongType: boolean;
  includeUnicode: boolean;
}

export const DEFAULT_GENERATOR_OPTIONS: GeneratorOptions = {
  includeValid: true,
  includeBoundary: true,
  includeNegative: true,
  includeSpecial: true,

  includeNull: true,
  includeEmpty: true,
  includeWhitespace: true,
  includeWrongType: true,
  includeUnicode: true,
};
