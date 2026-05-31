# ShipBrain Incident Hotfix
Incident: Checkout API latency breach on release-v2026.05.31-1111
Source release: release-v2026.05.31-1111
Repository: JeevantheDev/shipbrain_sandbox
## AI analysis
Root cause: The checkout API latency breach is caused by the payment-provider sandbox endpoint returning ETIMEDOUT errors, leading to POST /api/checkout requests timing out.
Fix proposal: Disable the PAYMENT_RETRY_FANOUT feature flag to prevent retry fanout on payment failures and redeploy the previous stable cart release to restore normal checkout API latency.
How it occurred: The release-v2026.05.31-1111 included UI changes such as updating the checkout heading color to blue for ShipBrain E2E tests. No direct changes to payment or retry logic were made in this release.
## Related release commits
- 6d6395c Update checkout heading color to blue in index.html for ShipBrain E2E test
- 4706ea0 Merge pull request #101 from JeevantheDev/update-checkout-heading-color



### Related incidents
- Checkout API latency breach on release-v2026.05.31-1111 [critical] (investigating)
## Developer instructions
1. Implement the fix on this hotfix branch.
2. Keep commits focused and descriptive; ShipBrain will re-read this PR before manager approval.
3. When the PR is reviewed, approve the incident fix in ShipBrain to merge this PR and trigger CI.
ShipBrain-codegen: incident-hotfix-handoff-only