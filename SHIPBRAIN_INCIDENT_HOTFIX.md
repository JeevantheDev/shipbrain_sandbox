# ShipBrain Incident Hotfix
Incident: Checkout API latency breach on v1.0.1
Source release: v1.0.1
Repository: JeevantheDev/shipbrain_sandbox
## AI analysis
Root cause: The checkout API latency breach on release v1.0.1 is primarily caused by the payment-provider sandbox endpoint returning ETIMEDOUT errors, leading to POST /api/checkout requests timing out.
Fix proposal: Disable the PAYMENT_RETRY_FANOUT feature to prevent repeated retry attempts that exacerbate latency, and coordinate with the payment-provider team to resolve the sandbox endpoint timeout issues.
How it occurred: Release v1.0.1 introduced changes that interact with the payment-provider sandbox endpoint, which is currently experiencing ETIMEDOUT errors, causing increased latency and timeouts in the checkout API.
## Related release commits
- No linked release commits were found.



### Related incidents
- Checkout API latency breach on v1.0.1 [critical] (investigating)
## Developer instructions
1. Implement the fix on this hotfix branch.
2. Keep commits focused and descriptive; ShipBrain will re-read this PR before manager approval.
3. When the PR is reviewed, approve the incident fix in ShipBrain to merge this PR and trigger CI.
ShipBrain-codegen: incident-hotfix-handoff-only