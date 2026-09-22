# TestForge QA - MVP Requirements

> Version: 1.0  
> Product phase: MVP 1.0  
> Document type: Derived developer specification  
>
> The controlled documents under `docs/controlled/` are authoritative. If this document conflicts with a controlled document, the controlled document takes precedence.

## 1. Product Objective

TestForge QA is a browser-based QA test-data generation application. A user defines fields, constraints, generation options, and simple business rules. TestForge produces deterministic and explainable test cases for manual and automated testing.

The MVP is free and usable without registration.

## 2. MVP Scope

### 2.1 Included

The MVP shall provide:

- project configuration in the browser
- field definition and validation
- deterministic test-data generation
- valid, boundary, negative, special, and business-rule cases
- simple conditional business rules
- human-readable reasons for generated cases
- stable ordering and semantic deduplication
- CSV export
- JSON export
- browser `localStorage` persistence
- built-in examples

### 2.2 Explicitly Excluded

The MVP does not include:

- authentication or user accounts
- payment, subscriptions, or billing
- backend database
- cloud project storage
- LLM/AI-generated test cases
- Jira, TestMo, or TestRail integrations
- native Cypress, Playwright, or Postman export
- Excel or PDF export
- OpenAPI or JSON Schema import
- regex-driven generation
- pairwise/N-way combinatorial generation
- team collaboration or RBAC

Roadmap functionality must not be introduced without an approved scope change.

## 3. Supported Field Types

The MVP supports:

- `string`
- `integer`
- `decimal`
- `enum`
- `boolean`

A field has an ID, name, type, required flag, and type-appropriate constraints.

Relevant constraints include:

- numeric `min` and `max`
- string `minLength` and `maxLength`
- decimal `decimalPlaces`
- enum `allowedValues`
- `allowSpaces`
- `allowSpecialCharacters`
- `allowUnicode`

Invalid or incompatible project configuration must be rejected by validation rather than silently interpreted.

## 4. Generator Options

The following options are supported and default to `true`:

- `includeValid`
- `includeBoundary`
- `includeNegative`
- `includeSpecial`
- `includeNull`
- `includeEmpty`
- `includeWhitespace`
- `includeWrongType`
- `includeUnicode`

Disabling an option shall suppress cases generated specifically for that option.

## 5. Generated Case Contract

Generation produces `GeneratedCase[]`.

A generated case contains:

- `id`
- optional `fieldId`
- optional `fieldName`
- optional single `value`
- optional multi-field `values`
- `category`
- `expected`
- `reason`
- optional `sourceConstraint`
- optional `sourceRuleId`

Categories:

- `valid`
- `boundary`
- `negative`
- `special`
- `business-rule`

Expected results:

- `valid`
- `invalid`
- `conditional`

Every generated case must contain a non-empty human-readable reason.

## 6. Field Generation Requirements

### 6.1 String

String generation shall support applicable deterministic cases for:

- representative valid value
- `minLength - 1`
- `minLength`
- `minLength + 1`
- `maxLength - 1`
- `maxLength`
- `maxLength + 1`
- null
- empty string
- whitespace-only
- leading whitespace
- trailing whitespace
- Unicode
- emoji
- HTML-like input
- newline
- tab
- wrong datatype
- character-class violations where applicable

Boundary cases retain category `boundary` whether their expected result is valid or invalid.

HTML/XSS-like strings are data and must never execute as markup.

### 6.2 Integer

Integer generation shall support applicable cases for:

- `min - 1`
- `min`
- `min + 1`
- `max - 1`
- `max`
- `max + 1`
- representative midpoint
- null
- numeric string
- alphabetic string
- decimal wrong datatype

Negative numeric ranges must be supported.

### 6.3 Decimal

Decimal generation shall use exact decimal/minor-unit arithmetic for boundary construction and must not expose binary floating-point artifacts.

For `min=1.00`, `max=500.00`, `decimalPlaces=2`, applicable boundaries include:

- `0.99`, `1.00`, `1.01`
- `499.99`, `500.00`, `500.01`

### 6.4 Enum

Enum generation shall support applicable cases for:

- every allowed value
- null
- empty
- unknown value
- meaningful case variant where applicable

### 6.5 Boolean

Boolean generation shall generate `true` and `false`.

Applicable negative candidates may include:

- null
- `"true"`
- `"false"`
- `1`
- `0`
- `"yes"`
- `"no"`

## 7. Business Rules

MVP business rules use:

`IF condition [AND condition] [AND condition] THEN outcome`

Limits:

- maximum 3 conditions
- exactly one outcome

Condition operators:

- `eq`
- `neq`
- `gt`
- `gte`
- `lt`
- `lte`
- `contains`
- `empty`
- `not-empty`

Outcome operators:

- `eq`
- `neq`
- `available`
- `unavailable`

Generation shall create at least one triggering scenario and reasonable one-condition-at-a-time near misses. Exhaustive Cartesian combinations are out of scope.

## 8. Validation

Project configuration shall be validated before generation.

Validation shall cover:

- field structure and supported field types
- type-appropriate constraints
- `min <= max`
- `minLength <= maxLength`
- valid decimal-place configuration
- enum with at least one allowed value
- business rule condition count
- references to existing field IDs

Invalid configuration must produce controlled validation feedback and must not crash the application.

## 9. Determinism, Deduplication and Ordering

Given the same normalized project and options, TestForge shall produce the same canonical cases.

Random values, timestamps, and nondeterministic identifiers must not affect canonical generation.

Single-field semantic identity includes:

- `fieldId`
- value
- expected result
- category

Multi-field semantic identity includes:

- sorted values
- expected result
- `sourceRuleId`

Stable category order:

1. `valid`
2. `boundary`
3. `negative`
4. `special`
5. `business-rule`

Final IDs are assigned after stable ordering:

`TF-001`, `TF-002`, `TF-003`, ...

## 10. Export

The MVP supports CSV and JSON.

CSV shall correctly escape:

- commas
- double quotes
- newlines
- Unicode

Spreadsheet-safe CSV mode shall mitigate formula injection for values beginning with:

- `=`
- `+`
- `-`
- `@`

JSON shall preserve raw values. Spreadsheet escaping must not be applied to JSON.

## 11. Persistence

Project configuration is stored locally in the browser.

Primary key:

`testforge.project.v1`

Optional settings may use:

`testforge.settings.v1`

Requirements:

- schema version `1`
- safe restoration
- approximately 500-1000 ms debounced autosave
- corrupt or incompatible stored data must not crash the application

Privacy copy:

> Test configurations and generated values are processed in your browser and are not uploaded to TestForge.

## 12. Built-in Examples

The MVP includes examples for:

- Username Validation
- Payment Amount
- Parcel Weight
- Address Length
- Boolean Flag
- Product Eligibility

Examples shall use the same project, validation, and generation contracts as user-created configurations.

## 13. Non-functional Requirements

### Performance

Typical modern desktop target:

- up to 20 fields
- up to 20 rules
- up to 1000 generated cases
- typical generation target under approximately 500 ms

### Browser Support

Primary QA focus:

- latest Chrome
- latest Edge

Supported target:

- latest Firefox
- latest Safari

### Accessibility

Baseline requirements include:

- keyboard usability
- associated labels
- visible focus
- readable validation feedback

### Security

Generated values must be rendered as text.

Do not use `dangerouslySetInnerHTML` for generated values.

### Analytics Privacy

If analytics is introduced, events must not contain:

- field names
- business-rule text/content
- generated values

## 14. MVP Completion Principle

A feature is not complete merely because the UI renders. Its applicable domain behavior, validation, deterministic generation, automated tests, type safety, linting, and production build must also pass.
