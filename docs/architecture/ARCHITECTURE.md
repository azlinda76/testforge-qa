# TestForge QA - Architecture

> Version: 1.0  
> Product phase: MVP 1.0  
> Document type: Derived engineering specification  
>
> The controlled documents under `docs/controlled/` are authoritative.

## 1. Architectural Goals

The MVP architecture prioritizes:

- deterministic behavior
- clear separation of concerns
- testability
- browser-local operation
- safe evolution toward future commercial capabilities
- independence of the generation engine from UI, payment, and account concerns

## 2. Technology Baseline

- Next.js 16.x
- React 19.x
- TypeScript 5.x with strict typing
- Tailwind CSS 4
- Zod 4.x
- Vitest 4.x
- Cypress
- browser `localStorage`
- Cloudflare-oriented hosting

No TestForge backend is required for MVP.

## 3. Layering

```text
Presentation
    ↓
Domain
    ↓
Validation / Normalization
    ↓
Generation / Rules
    ↓
Deduplication / Ordering
    ↓
Persistence / Export
```

Responsibilities:

### Presentation
Pages, components, forms, results, filters, user feedback, accessibility.

The presentation layer must not implement field-generation algorithms.

### Domain
Canonical TypeScript types and contracts shared across the application.

The domain layer must not depend on React.

### Validation
Zod schemas and cross-field/project validation.

### Generation
Datatype-specific deterministic generators and dispatcher/registry.

Generators must not depend on React or UI state.

### Rules
Business-rule evaluation and rule-based case generation.

### Persistence
Versioned browser storage, restoration, corruption handling, and autosave.

### Export
Canonical `GeneratedCase[]` to CSV or JSON.

## 4. Repository Structure

```text
src/
├── app/
├── components/
├── domain/
├── lib/
│   ├── validation/
│   ├── generators/
│   ├── rules/
│   ├── persistence/
│   └── export/
├── data/
├── hooks/
└── types/

tests/
cypress/
postman/        # introduced when an API exists
public/
docs/
```

## 5. Domain Contracts

### Field Types

```typescript
type FieldType =
  | 'string'
  | 'integer'
  | 'decimal'
  | 'enum'
  | 'boolean';
```

Primitive values are strings, numbers, booleans, or null.

A `TestField` contains:

- `id`
- `name`
- optional `label`
- `type`
- `required`
- `constraints`

Constraints can include:

- `min`
- `max`
- `minLength`
- `maxLength`
- `decimalPlaces`
- `allowedValues`
- `allowSpaces`
- `allowSpecialCharacters`
- `allowUnicode`

### Generated Case

Canonical generated output supports:

- ID
- field traceability
- single or multi-field values
- category
- expected result
- reason
- source constraint/rule traceability

The canonical object is the source for UI presentation and exports.

## 6. Generator Contract

```typescript
export interface FieldGenerator {
  supports(field: TestField): boolean;

  generate(
    field: TestField,
    options: GeneratorOptions,
  ): GeneratedCase[];
}
```

The dispatcher selects the first registered supporting generator.

If no generator supports the field, a controlled `GeneratorError` is raised.

Silent successful empty output is not an acceptable substitute for an unsupported generator.

## 7. Canonical Generation Pipeline

```text
TestForgeProject
      ↓
Zod validation
      ↓
Normalization
      ↓
Field generators
      ↓
Business-rule generator
      ↓
Semantic deduplication
      ↓
Stable ordering
      ↓
Final TF-xxx ID assignment
      ↓
GeneratedCase[]
      ↓
UI / CSV / JSON
```

Final IDs must not be assigned by individual field generators because ordering and deduplication occur later.

During generator implementation, provisional/empty IDs may be used until the canonical finalization stage.

## 8. Determinism

Generators must produce canonical deterministic candidates.

Avoid:

- random test values in canonical generation
- timestamps
- UUIDs
- environment-dependent ordering
- locale-dependent behavior unless explicitly normalized

The same normalized input and options must yield the same semantic output.

## 9. Deduplication

Single-field semantic key:

```text
fieldId / value / expected / category
```

Multi-field semantic key:

```text
sorted values / expected / sourceRuleId
```

Serialization used for semantic keys must preserve value type so that, for example, numeric `1` and string `"1"` are not accidentally treated as identical.

## 10. Ordering and IDs

Category precedence:

```text
valid
boundary
negative
special
business-rule
```

Within categories, deterministic generation/source order is preserved or explicitly normalized.

After deduplication and ordering, IDs are assigned sequentially:

```text
TF-001
TF-002
TF-003
```

## 11. Validation Architecture

Validation occurs before generation.

Zod handles structural/type validation.

Project-level validation handles relationships such as rule field references.

Validation must be explicit rather than relying on generators to repair malformed configuration.

## 12. Business Rule Architecture

A business rule contains:

- ID
- name
- one to three conditions
- one outcome
- optional description

Rules refer to fields by field ID.

The rule generator produces:

- a trigger scenario
- reasonable one-condition-at-a-time near misses

It must not perform exhaustive combinatorial expansion.

Rule-generated cases retain `sourceRuleId`.

## 13. Persistence Architecture

MVP storage is browser-local.

Primary key:

```text
testforge.project.v1
```

Optional settings key:

```text
testforge.settings.v1
```

Persisted project schema version:

```text
1
```

Persistence code must:

- serialize only required project state
- validate restored data
- handle corrupt/incompatible data safely
- debounce autosave approximately 500-1000 ms
- avoid making storage behavior part of domain generation

Future cloud persistence should be implemented through a separate persistence adapter/service rather than embedding network concerns in the generation engine.

## 14. Export Architecture

Export consumes canonical generated cases.

### CSV
Responsibilities include:

- stable columns
- CSV escaping
- Unicode
- newline handling
- optional spreadsheet-safe value transformation

### JSON
JSON preserves canonical raw values.

CSV-specific spreadsheet safety must not mutate canonical cases or JSON output.

## 15. Security Architecture

Generated attack-like strings are untrusted data.

Requirements:

- render generated values as text
- never use `dangerouslySetInnerHTML` for generated values
- avoid DOM interpretation of user-defined/generated HTML
- keep analytics payloads free of test values and requirement content

## 16. Future Commercial Boundary

Future functionality may introduce:

- authentication
- accounts
- subscription/payment
- cloud projects
- integrations
- AI-assisted requirement parsing

These concerns must remain outside low-level generators.

Conceptually:

```text
Commercial / Account / Entitlement Layer
                  ↓
Application Features
                  ↓
Deterministic Generation Engine
```

Entitlement checks decide whether a capability may be invoked; they do not change the correctness rules inside datatype generators.

## 17. Engineering Constraints

Do:

- use strict TypeScript
- keep domain and generators framework-independent
- prefer small pure functions
- expose controlled errors
- test behavioral changes
- maintain deterministic output

Do not:

- use `any` to conceal design/type errors
- place generation algorithms in React components
- mutate canonical output during export
- silently repair invalid requirements
- introduce backend dependencies into MVP generation
- bypass dependency conflicts with `--force` or `--legacy-peer-deps` without explicit approval
