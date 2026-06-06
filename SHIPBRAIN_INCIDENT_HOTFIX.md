# ShipBrain Incident Hotfix
Incident: Checkout API latency breach on v1.0.4
Source release: v1.0.4
Repository: JeevantheDev/shipbrain_sandbox
## AI analysis
Root cause: The checkout API latency breach on release v1.0.4 is caused by the payment-provider sandbox endpoint returning ETIMEDOUT errors, leading to POST /api/checkout requests timing out.
Fix proposal: Investigate and fix the payment-provider sandbox endpoint to resolve ETIMEDOUT errors. Temporarily disable PAYMENT_RETRY_FANOUT to reduce retry attempts and redeploy the previous stable cart release until the payment-provider issue is resolved.
How it occurred: Release v1.0.4 introduced changes that rely on the payment-provider sandbox endpoint, which is currently timing out and causing checkout API latency breaches and request timeouts.
## Related release commits
- No linked release commits were found.



### Related incidents
- Checkout API latency breach on v1.0.4 [critical] (investigating)
## Developer instructions
1. Implement the fix on this hotfix branch.
2. Keep commits focused and descriptive; ShipBrain will re-read this PR before manager approval.
3. When the PR is reviewed, approve the incident fix in ShipBrain to merge this PR and trigger CI.
ShipBrain-codegen: incident-hotfix-handoff-only