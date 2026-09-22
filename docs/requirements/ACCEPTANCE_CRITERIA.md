# TestForge QA - MVP Acceptance Criteria

> Version: 1.0  
> Product phase: MVP 1.0  
> Document type: Derived developer acceptance specification  
>
> The controlled documents under `docs/controlled/` are authoritative.

## 1. Product Scope

### AC-MVP-001 Free Access
Given a user opens TestForge QA, when they use MVP functionality, then authentication, account creation, payment, and subscription are not required.

### AC-MVP-002 Local-first
Given a user configures a project, when the project is saved, then MVP project persistence uses browser-local storage rather than a TestForge backend database.

### AC-MVP-003 No implicit roadmap scope
Given a roadmap capability is not part of MVP, when implementing an MVP ticket, then that capability is not introduced unless an approved scope change explicitly requires it.

## 2. Field Configuration and Validation

### AC-FLD-001 Supported types
The application accepts `string`, `integer`, `decimal`, `enum`, and `boolean` fields.

### AC-FLD-002 Constraint consistency
Configurations where numeric `min > max` or string `minLength > maxLength` are rejected with controlled validation feedback.

### AC-FLD-003 Enum values
An enum field without at least one allowed value is rejected.

### AC-FLD-004 Rule references
A business-rule condition or outcome referencing a nonexistent field is rejected.

### AC-FLD-005 Safe failure
Invalid project configuration does not crash the application or silently produce a successful empty generation result.

## 3. Generator Contract

### AC-GEN-001 Dispatcher
Given a supported field, the dispatcher selects a registered generator whose `supports()` method accepts the field.

### AC-GEN-002 Unsupported generator
Given no registered generator supports a field, generation fails through a controlled generator error rather than silently returning success.

### AC-GEN-003 Determinism
Given identical normalized project input and options, repeated generation produces the same canonical cases in the same order.

### AC-GEN-004 Reasons
Every generated case contains a non-empty human-readable reason.

### AC-GEN-005 Options
When a generation option is disabled, cases specifically controlled by that option are absent.

## 4. String Generator

For a string with `minLength=5` and `maxLength=35`, applicable boundary generation includes:

- length 4 -> boundary, invalid
- length 5 -> boundary, valid
- length 6 -> boundary, valid
- length 34 -> boundary, valid
- length 35 -> boundary, valid
- length 36 -> boundary, invalid

Additional applicable cases include:

- representative valid value
- null
- empty
- whitespace-only
- leading whitespace
- trailing whitespace
- Unicode
- emoji
- special-character input
- HTML-like input
- newline
- tab
- wrong datatype

Expected validity reflects field constraints such as `required`, `allowSpaces`, `allowSpecialCharacters`, and `allowUnicode`.

Semantic duplicate cases are not returned.

## 5. Integer Generator

Where min/max exist, applicable cases include:

- `min - 1`, `min`, `min + 1`
- `max - 1`, `max`, `max + 1`
- deterministic representative midpoint

Wrong-type/negative candidates include applicable numeric strings, alphabetic strings, and decimal values.

Negative ranges work correctly.

## 6. Decimal Generator

Boundary increments use `10^-decimalPlaces`.

For `min=1.00`, `max=500.00`, `decimalPlaces=2`, generated applicable boundaries include `0.99`, `1.00`, `1.01`, `499.99`, `500.00`, and `500.01`.

Generated values do not expose floating-point artifacts such as long binary approximation tails.

## 7. Enum Generator

Every configured allowed value can be generated as a valid candidate.

Applicable invalid/special candidates include unknown value, null, empty, and meaningful case variants.

## 8. Boolean Generator

Both `true` and `false` are generated as valid Boolean candidates.

Applicable negative candidates may include null, string booleans, numeric booleans, and yes/no strings.

## 9. Business Rules

### AC-RUL-001 Structure
A rule contains one to three conditions and one outcome.

### AC-RUL-002 Trigger
For a valid rule, generation includes at least one case satisfying all rule conditions and exercising the outcome.

### AC-RUL-003 Near miss
Reasonable near-miss cases are produced by changing one condition at a time.

### AC-RUL-004 No exhaustive Cartesian generation
Rule generation does not attempt exhaustive combinations of all field values.

### AC-RUL-005 Traceability
Rule-generated cases identify the source rule.

## 10. Deduplication, Ordering and IDs

### AC-OUT-001 Deduplication
Semantically equivalent cases according to the defined single-field or multi-field identity are returned once.

### AC-OUT-002 Stable ordering
Cases are ordered by category:

1. valid
2. boundary
3. negative
4. special
5. business-rule

### AC-OUT-003 Final IDs
IDs are assigned after canonical ordering as `TF-001`, `TF-002`, etc.

Repeated generation of unchanged input produces the same canonical ordering and IDs.

## 11. Export

### AC-EXP-001 CSV
CSV export correctly handles commas, quotes, newlines, and Unicode.

### AC-EXP-002 Spreadsheet safety
When spreadsheet-safe mode is enabled, potentially formula-executable values beginning with `=`, `+`, `-`, or `@` are mitigated in CSV output.

### AC-EXP-003 JSON
JSON export preserves raw values and does not apply spreadsheet-specific escaping.

## 12. Persistence

### AC-PER-001 Save
A valid project can be persisted under the versioned local-storage contract.

### AC-PER-002 Restore
A valid stored project can be restored after reload.

### AC-PER-003 Autosave
Changes are persisted with an approximately 500-1000 ms debounce rather than synchronous storage writes on every keystroke.

### AC-PER-004 Corrupt state
Malformed, corrupt, or incompatible persisted data does not crash application startup.

## 13. Security and Rendering

### AC-SEC-001 Markup as data
A generated value such as `<script>alert(1)</script>` is displayed as text and is not executed.

### AC-SEC-002 Unsafe rendering
Generated values are not rendered with `dangerouslySetInnerHTML`.

## 14. Accessibility

Critical MVP workflows are keyboard usable.

Form controls have meaningful labels.

Interactive elements provide visible focus.

Validation feedback is readable and associated with the relevant configuration.

## 15. Performance

A typical modern desktop should generate up to approximately:

- 20 fields
- 20 rules
- 1000 cases

within the MVP target of roughly 500 ms under normal conditions.

## 16. Development Ticket Definition of Done

A development ticket is complete when:

- its acceptance criteria are implemented
- appropriate automated tests exist
- relevant unit tests pass
- `npm run typecheck` passes
- `npm run lint` passes
- `npm run build` passes
- applicable Cypress coverage passes when the affected UI workflow exists
- no unrelated roadmap functionality is introduced
- architecture boundaries remain intact
- documentation is updated if an approved requirement changed
