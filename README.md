# shipbrain_sandbox
This repo is a sandbox sample repo for shipbrain to test 
# ShipBrain Sandbox

This repo contains a tiny sandbox app used to test ShipBrain workflows.

## PagerDuty-style incident drill

Open `index.html` in a browser. It behaves like a small checkout service control panel with a **Trigger incident** button.

The button posts a realistic alert payload to:

```text
https://YOUR-NGROK-URL/api/webhooks/incidents
```

Use the current ShipBrain ngrok URL while the local app is running.

ShipBrain requires this repo to be connected during onboarding before it accepts the incident webhook.
