# TestForge QA - Test Strategy

> Version: 1.0  
> Product phase: MVP 1.0  
> Document type: Derived QA and automation specification  
>
> The controlled documents under `docs/controlled/` are authoritative.

## 1. Objective

Testing must prove that TestForge produces deterministic, correct, explainable, safe QA test data while keeping feedback fast enough for active development.

The strategy uses the lowest practical test layer for each behavior.

## 2. Test Layers

```text
Many      Vitest unit/domain tests
  ↑       focused integration tests
  ↑       Cypress critical UI workflows
Few       Postman/Newman API flows when APIs exist
```

Do not reproduce every generator permutation in Cypress.

Generator correctness belongs primarily in Vitest.

## 3. Vitest

Vitest covers:

- datatype generators
- generator registry and dispatcher
- validation schemas
- project-level validation
- business-rule evaluation/generation
- semantic deduplication
- stable ordering
- final ID assignment
- CSV export
- JSON export
- persistence serialization/restoration
- corruption handling
- deterministic behavior

### Generator Test Pattern

Each datatype generator should test:

- `supports()` behavior
- representative valid generation
- boundaries
- negative cases
- special cases
- relevant option toggles
- constraint-driven expected validity
- non-empty reasons
- field traceability
- deterministic repeated execution
- absence of semantic duplicates

### String Generator Coverage

String tests should include, where applicable:

- minLength - 1 / minLength / minLength + 1
- maxLength - 1 / maxLength / maxLength + 1
- null
- empty
- whitespace-only
- leading/trailing whitespace
- Unicode
- emoji
- special characters
- HTML-like values
- newline/tab
- wrong datatype
- `allowSpaces`
- `allowSpecialCharacters`
- `allowUnicode`
- generation option toggles

Some tests may initially be red while implementing the corresponding ticket; they become release-blocking before the ticket is complete.

## 4. Cypress

Cypress validates browser behavior and integration between UI and domain services.

Critical workflows include:

- application landing/load
- creating/configuring fields
- displaying validation errors
- generating cases
- configuring business rules
- viewing/filtering generated cases
- loading built-in examples
- CSV export initiation
- JSON export initiation
- project persistence across reload
- recovery from invalid/corrupt local state
- safe display of HTML/XSS-like generated values
- keyboard-critical workflows where practical

Cypress should assert user-observable behavior, not internal implementation details.

## 5. API Testing

MVP has no TestForge backend API.

Therefore Postman/Newman is not an MVP release blocker solely for the sake of having API tests.

When TestForge introduces backend, payment, account, or integration APIs, Postman/Newman should cover:

- authentication/authorization where applicable
- request/response contracts
- validation errors
- idempotency where relevant
- entitlement behavior
- error handling
- integration regressions

Do not create an API only to satisfy the testing toolchain.

## 6. Validation Testing

Validation tests should cover:

- each supported field type
- invalid discriminators
- min/max consistency
- minLength/maxLength consistency
- decimal-place constraints
- enum allowed values
- rule condition count
- invalid rule field references
- valid project acceptance
- malformed project rejection

## 7. Determinism Testing

For representative projects:

1. generate cases
2. generate again from identical input
3. compare canonical semantic output
4. verify ordering
5. verify IDs after finalization

Tests must fail if random/time-dependent behavior changes canonical results.

## 8. Deduplication Testing

Test:

- exact semantic duplicate removal
- different categories retained where semantic key requires category
- valid vs invalid variants retained where expected differs
- numeric vs string value distinction
- multi-field ordering normalization
- source-rule distinction

## 9. Export Testing

### CSV

Test values containing:

- comma
- double quote
- CR/LF/newline
- Unicode
- emoji
- `=`
- `+`
- `-`
- `@`

Verify correct CSV quoting and spreadsheet-safe transformation when enabled.

### JSON

Verify:

- valid JSON
- raw values preserved
- value types preserved
- Unicode preserved
- no CSV/spreadsheet transformation

## 10. Persistence Testing

Test:

- project save
- project restore
- schema version
- debounced autosave behavior where practical
- missing storage
- malformed JSON
- invalid schema
- incompatible version
- safe fallback without application crash

## 11. Security Testing

At minimum, generated strings such as HTML/script-like payloads must be exercised through UI rendering.

The test passes only when the payload is visible as data and no script/markup execution occurs.

No production code should use `dangerouslySetInnerHTML` for generated values.

## 12. Performance Testing

For the MVP target, maintain a representative project approaching:

- 20 fields
- 20 rules
- up to 1000 generated cases

Measure generation separately from unrelated browser/network startup where possible.

The target is approximately under 500 ms on a typical modern desktop, recognizing environment variability.

## 13. Browser Coverage

Primary QA:

- latest Chrome
- latest Edge

Supported:

- latest Firefox
- latest Safari

Automated CI browser coverage may be staged according to available infrastructure, but browser-specific defects must not be ignored when the supported browser can reproduce them.

## 14. Test Data Principles

Automated test fixtures should be:

- deterministic
- readable
- minimal for the behavior under test
- independent where practical
- free from production personal data
- explicit about expected category and validity

## 15. Defect Regression

A defect fix should include an automated regression test at the lowest appropriate layer whenever technically practical.

Examples:

- generator defect -> Vitest
- export defect -> Vitest
- rendering defect -> Cypress
- future API contract defect -> Postman/Newman or API-level automated test

## 16. Quality Gates

For implementation tickets:

```powershell
npm test
npm run typecheck
npm run lint
npm run build
```

When affected UI functionality exists, run the applicable Cypress suite.

When applicable APIs exist, run the relevant Newman collection.

Do not declare a ticket complete while a required quality gate is failing because of the change.

## 17. Pull Request Evidence

A PR should make it possible to determine:

- what behavior changed
- which requirement/ticket it implements
- which tests were added or changed
- which quality gates were executed
- whether any known limitation remains

## 18. Definition of Done

Testing is complete for a ticket when:

- acceptance behavior is covered at the appropriate layer
- regressions relevant to the change pass
- deterministic output is preserved
- typecheck/lint/build pass
- security-sensitive rendering remains safe
- no test was disabled merely to obtain a green pipeline
