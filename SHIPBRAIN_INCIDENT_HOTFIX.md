# ShipBrain Incident Hotfix

Incident: Checkout API latency breach on release-v2026.05.28-063124-ti8c
Source release: release-v2026.05.28-063124-ti8c
Repository: JeevantheDev/shipbrain_sandbox

## AI analysis

Root cause: The checkout-api p95 latency breached 2400ms due to ETIMEDOUT errors from the external payment-provider sandbox endpoint. The commits in this release only modify the checkout heading color to blue, indicating that the release commits do not have a causal relationship with the latency breach. The issue is likely triggered by an external dependency failure combined with the PAYMENT_RETRY_FANOUT configuration.

Fix proposal: Disable the PAYMENT_RETRY_FANOUT configuration/feature flag to mitigate the retry storm to the failing payment-provider sandbox. Coordinate with the payment provider to resolve their sandbox endpoint timeouts.

How it occurred: This release introduced a minor UI change updating the checkout heading color to blue. Concurrently, a latency breach occurred on the checkout API due to external payment provider timeouts.

## Related release commits
- 62362fd test: update checkout heading color to blue
- 5a0d92b Merge pull request #57 from JeevantheDev/test-update-checkout-heading-color

## Developer instructions

1. Implement the fix on this hotfix branch.
2. Keep commits focused and descriptive; ShipBrain will re-read this PR before manager approval.
3. When the PR is reviewed, approve the incident fix in ShipBrain to merge this PR and trigger CI.

ShipBrain-codegen: incident-hotfix-handoff-only