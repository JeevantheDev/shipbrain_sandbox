# shipbrain_sandbox
This repo is a sandbox sample repo for shipbrain to test 
# ShipBrain Sandbox

This repo contains a tiny mock shopping cart app used to test ShipBrain workflows. It does not use a real database or process real payments; checkout only sends a realistic PagerDuty incident payload.

## PagerDuty incident drill

Run the sandbox app:

```bash
PAGERDUTY_ROUTING_KEY="your-events-api-v2-routing-key" RELEASE_VERSION="cart-v2026.05.22" npm run dev
```

Open:

```text
http://localhost:5174
```

Click **Checkout** or **Trigger checkout latency incident**.

Flow:

```text
Mock cart checkout -> PagerDuty Events API v2 -> PagerDuty incident -> PagerDuty Generic Webhook v3 -> ShipBrain /api/webhooks/incidents
```

ShipBrain requires this repo to be connected during onboarding before it accepts the PagerDuty webhook incident. The event includes the current release version so Incident Commander can connect the alert back to the PR, CI approval, deployment audit, and release tag.

## ShipBrain approved Vercel deployment

Production deploys are intentionally not attached to `push`. ShipBrain approves a successful CI run, merges the Draft PR, creates the release tag, then dispatches `.github/workflows/shipbrain-vercel-prod.yml`.

Required GitHub Actions secrets for this sandbox repo:

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
PAGERDUTY_ROUTING_KEY
```

The PagerDuty key is passed to Vercel at deploy time so the production mock checkout can trigger the same incident path.

The workflow uses Vercel CLI:

```text
npx vercel@latest pull --yes --environment=production
npx vercel@latest build --prod
npx vercel@latest deploy --prebuilt --prod
```

The deployed checkout is still mock-only. It serves the same cart UI plus Vercel serverless endpoints for `/api/release` and `/api/trigger-incident`.
