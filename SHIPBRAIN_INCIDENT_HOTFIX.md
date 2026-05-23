# ShipBrain Incident Hotfix

Incident: Checkout API latency breach on cart-v2026.05.23
Source release: cart-v2026.05.23
Repository: JeevantheDev/shipbrain_sandbox

## AI analysis

Root cause: The Checkout API (POST /api/checkout) is experiencing a latency breach (p95 > 2400ms) due to downstream timeouts (ETIMEDOUT) from the payment-provider sandbox endpoint. This is likely exacerbated by the PAYMENT_RETRY_FANOUT mechanism, which may be causing cascading retries and timing out the client requests.

Fix proposal: Disable the PAYMENT_RETRY_FANOUT feature flag or configuration setting to prevent excessive retries to the failing payment-provider sandbox. Additionally, implement a circuit breaker and reduce the connection/read timeout for the payment provider integration to fail fast rather than holding up the checkout request.

How it occurred: This release (cart-v2026.05.23) promoted changes from the develop branch to main, which included previous hotfixes for checkout API latency breaches (e.g., hotfix-v2026.05.22-001) and minor UI changes. However, the underlying latency issue persists or has been reintroduced via the payment retry fanout behavior.

## Related release commits
- 48d4df4 hotfix: Checkout API latency breach on hotfix-v2026.05.22-001
- 2668a59 Change h2 color from red to blue
- 7e831d6 Merge pull request #10 from JeevantheDev/hotfix/incident-8bcc8afd-checkout-api-latency-breach-on-hotfix-v2026-05-2
- f24db26 hotfix: Checkout API latency breach on hotfix-v2026.05.22-001
- a07aff0 Change h2 color from blue to green
- cfe7559 Merge pull request #11 from JeevantheDev/hotfix/incident-8cf7a357-checkout-api-latency-breach-on-hotfix-v2026-05-2
- 48d4df4 hotfix: Checkout API latency breach on hotfix-v2026.05.22-001
- 2668a59 Change h2 color from red to blue
- 7e831d6 Merge pull request #10 from JeevantheDev/hotfix/incident-8bcc8afd-checkout-api-latency-breach-on-hotfix-v2026-05-2
- f24db26 hotfix: Checkout API latency breach on hotfix-v2026.05.22-001
- a07aff0 Change h2 color from blue to green
- cfe7559 Merge pull request #11 from JeevantheDev/hotfix/incident-8cf7a357-checkout-api-latency-breach-on-hotfix-v2026-05-2

## Developer instructions

1. Implement the fix on this hotfix branch.
2. Keep commits focused and descriptive; ShipBrain will re-read this PR before manager approval.
3. When the PR is reviewed, approve the incident fix in ShipBrain to merge this PR and trigger CI.

ShipBrain-codegen: incident-hotfix-handoff-only