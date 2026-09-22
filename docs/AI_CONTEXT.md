# TestForge QA — AI Development Context

> Version: 1.0  
> Product phase: MVP 1.0  
> Status: Active Development

## Read This First

This document is the entry point for any AI coding assistant working on TestForge QA.

TestForge QA is a deterministic QA test-data generation application.

Users define fields, constraints, generation options, and simple business rules. TestForge generates explainable valid, invalid, boundary, special, and business-rule test data for manual and automated testing.

The controlled Product/Business documentation under `docs/controlled/` is authoritative.

If this document conflicts with a controlled requirement, the controlled requirement takes precedence.

---

## Required Reading

Before implementing a feature, read the applicable documents:

1. `docs/requirements/MVP_REQUIREMENTS.md`
2. `docs/requirements/ACCEPTANCE_CRITERIA.md`
3. `docs/architecture/ARCHITECTURE.md`
4. `docs/testing/TEST_STRATEGY.md`

For future-product context only:

5. `docs/roadmap/ROADMAP.md`

Do not implement roadmap functionality unless explicitly requested.

---

# Current Product Scope

TestForge QA MVP 1.0 is FREE.

The MVP is:

- browser based
- local first
- deterministic
- explainable
- usable without registration

The MVP does not require:

- authentication
- user accounts
- payment
- subscriptions
- backend database
- cloud project storage
- AI/LLM generation

Project configuration is persisted using browser `localStorage`.

---

# Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zod
- Vitest
- Cypress
- localStorage
- Cloudflare-oriented deployment

Postman/Newman is used when TestForge introduces backend or integration APIs.

Do not create an API solely for the purpose of API testing.

---

# Supported Field Types

```text
string
integer
decimal
enum
boolean
```
