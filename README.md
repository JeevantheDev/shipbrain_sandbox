# shipbrain_sandbox
This repo is a sandbox sample repo for shipbrain to test 
# ShipBrain Sandbox

This repo contains a tiny sandbox app used to test ShipBrain workflows.

## PagerDuty incident drill

Run the sandbox app:

```bash
PAGERDUTY_ROUTING_KEY="your-events-api-v2-routing-key" npm run dev
```

Open:

```text
http://localhost:5174
```

Click **Trigger PagerDuty incident**.

Flow:

```text
Sandbox app -> PagerDuty Events API v2 -> PagerDuty incident -> PagerDuty Generic Webhook v3 -> ShipBrain /api/webhooks/incidents
```

ShipBrain requires this repo to be connected during onboarding before it accepts the PagerDuty webhook incident.
