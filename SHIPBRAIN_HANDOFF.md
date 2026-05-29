# ShipBrain Developer Handoff

ShipBrain intentionally did not modify application source files for this Draft PR.

The developer should continue work on this feature branch and commit the requested implementation manually.

## Requested tasks

### Create typed implementation surface
Add the API or component entry point described by the ticket with validation and clear boundaries.

Suggested files: app/api/generated/route.ts

### Add user-facing workflow
Expose the generated capability in the relevant dashboard page using existing UI patterns.

Suggested files: components/generated/GeneratedCard.tsx

### Cover output parsing
Add a focused Vitest case for the response shape and failure path.

Suggested files: tests/unit/generated.test.ts
