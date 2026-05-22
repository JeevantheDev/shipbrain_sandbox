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
