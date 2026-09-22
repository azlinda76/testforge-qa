# TestForge QA - Product Roadmap

> Version: 1.0  
> Document type: Derived roadmap specification  
>
> The controlled documents under `docs/controlled/` are authoritative. This document describes direction, not permission to implement future scope.

## 1. Roadmap Principle

TestForge should validate the usefulness and correctness of deterministic QA test-data generation before adding commercial and collaborative complexity.

Roadmap items are not MVP requirements.

## 2. Phase 1 - Free MVP

Objective: prove the core product.

Capabilities:

- no login
- no payment
- browser-local projects
- string/integer/decimal/enum/boolean generation
- validation
- simple business rules
- deterministic output
- reasons/explainability
- deduplication and stable ordering
- CSV/JSON export
- localStorage
- built-in examples
- Vitest
- Cypress for critical UI workflows

Success means users can create useful QA test data without requiring cloud infrastructure or AI.

## 3. Phase 2 - Commercial Foundation

Potential capabilities:

- user accounts
- authentication
- subscription/payment
- entitlement management
- cloud project persistence
- account settings
- plan-aware feature access

Payment and entitlement logic should sit outside the low-level deterministic generation engine.

Exact provider, pricing, plans, limits, and packaging remain product decisions and are not fixed by this roadmap.

## 4. Phase 3 - Premium QA Capabilities

Potential premium features:

- advanced rule packs
- reusable project libraries
- advanced combinatorial generation
- pairwise/N-way strategies
- richer validation/generation policies
- larger project/case limits
- project templates

Capabilities should extend the engine through explicit contracts rather than embedding commercial checks in generator algorithms.

## 5. Phase 4 - Integrations and Adapters

Potential destinations/imports include:

- TestMo
- TestRail
- Jira
- Postman
- Cypress
- Playwright
- OpenAPI
- JSON Schema

Integration architecture should use adapters around canonical TestForge project/generated-case contracts.

The canonical engine output remains independent of any specific third-party destination.

## 6. Phase 5 - Team Workspaces

Potential capabilities:

- shared projects
- organization/workspace model
- roles and permissions
- reusable team rule packs
- change history
- project collaboration

RBAC and multi-user concerns should be introduced only when the cloud/account architecture exists.

## 7. AI-assisted Requirement Parsing

A future AI workflow may allow a user to provide requirement text and receive proposed:

- fields
- field types
- constraints
- business rules
- generation options

Recommended conceptual flow:

```text
Requirement text
      ↓
AI-assisted parser
      ↓
Structured TestForge proposal
      ↓
Human review / approval
      ↓
Validated TestForgeProject
      ↓
Deterministic generation engine
```

The AI should not replace deterministic generation as the source of truth.

Human approval is required before proposed requirement interpretation becomes executable project configuration.

## 8. Commercial Boundary

Future commercial architecture may determine whether a user can access a capability, for example:

```text
Account / Subscription / Entitlement
                 ↓
           Feature access
                 ↓
      TestForge application service
                 ↓
    Deterministic generation engine
```

The engine itself should remain testable without a payment provider.

## 9. Items Not Yet Decided

The roadmap does not establish:

- exact subscription price
- exact plan names
- free-tier limits after commercialization
- payment provider
- authentication provider
- cloud database/provider
- exact AI model/provider
- exact integration sequence
- release dates

These require future Product/Business Owner decisions.

## 10. Change Control

Moving a roadmap capability into MVP or an active release requires:

1. product decision
2. impact assessment
3. controlled requirement update
4. change/decision register update
5. architecture/test impact update
6. implementation ticket(s)
7. automated test coverage
8. PR and release process

Roadmap text alone is not implementation authorization.
