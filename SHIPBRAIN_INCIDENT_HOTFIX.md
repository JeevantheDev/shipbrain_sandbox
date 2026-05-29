# ShipBrain Incident Hotfix

Incident: Checkout API latency breach on release-v2026.05.28-1644
Source release: release-v2026.05.28-1644
Repository: JeevantheDev/shipbrain_sandbox

## AI analysis

Root cause: Production alert: checkout-api p95 latency breached 2400ms on release release-v2026.05.28-1644.\nCustomer action: confirm checkout submitted cart total $115.92.\nImpact: POST /api/checkout requests timing out for test tenants.\nSuspected dependency: payment-provider sandbox endpoint returning ETIMEDOUT.\nSuggested rollback: disable PAYMENT_RETRY_FANOUT and redeploy previous cart release.

Fix proposal: Developer to investigate and implement fix

How it occurred: ShipBrain did not receive enough commit context to infer a precise path.

## Related release commits
- No linked release commits were found.

## Developer instructions

1. Implement the fix on this hotfix branch.
2. Keep commits focused and descriptive; ShipBrain will re-read this PR before manager approval.
3. When the PR is reviewed, approve the incident fix in ShipBrain to merge this PR and trigger CI.

ShipBrain-codegen: incident-hotfix-handoff-only