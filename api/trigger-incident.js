export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const routingKey = process.env.PAGERDUTY_ROUTING_KEY;
  const releaseVersion = process.env.SHIPBRAIN_RELEASE_TAG ?? process.env.RELEASE_VERSION ?? "cart-v2026.05.24";

  const payload = request.body ?? {};
  if (payload.shouldTriggerIncident === false) {
    response.status(200).json({
      outcome: "checkout_succeeded",
      releaseVersion: payload.releaseVersion ?? releaseVersion,
      headingColor: payload.headingColor ?? "not provided",
      message: "PagerDuty was not triggered because the checkout heading is not green."
    });
    return;
  }

  const dedupKey = `shipbrain-sandbox-${payload.service ?? "checkout-api"}-${payload.environment ?? "sandbox"}-${releaseVersion}`;

  let pagerDutyAccepted = false;
  let pagerDutyStatus = 0;
  let pagerDutyBody = {};

  if (routingKey) {
    const pagerDutyPayload = {
      routing_key: routingKey,
      event_action: "trigger",
      dedup_key: dedupKey,
      payload: {
        summary: payload.title,
        source: payload.repo,
        severity: payload.severity,
        component: payload.service,
        group: payload.environment,
        class: "sandbox-drill",
        custom_details: {
          repo: payload.repo,
          environment: payload.environment,
          service: payload.service,
          severity: payload.severity,
          logs: payload.logs,
          branch: payload.branch,
          commit: payload.commit,
          releaseVersion: payload.releaseVersion ?? releaseVersion,
          cart: payload.cart,
          mockCheckout: true
        }
      },
      links: [
        {
          href: "https://github.com/JeevantheDev/shipbrain_sandbox",
          text: "Sandbox repository"
        }
      ],
      images: []
    };

    try {
      const pagerDutyResponse = await fetch("https://events.pagerduty.com/v2/enqueue", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(pagerDutyPayload)
      });
      pagerDutyAccepted = pagerDutyResponse.ok;
      pagerDutyStatus = pagerDutyResponse.status;
      pagerDutyBody = await pagerDutyResponse.json().catch(() => ({}));
    } catch (e) {
      console.error("PagerDuty enqueue failed", e);
    }
  }

  const shipBrainApiUrl = process.env.SHIPBRAIN_API_URL;
  const shipBrainApiKey = process.env.SHIPBRAIN_API_KEY;
  const shipBrainWebhookUrl =
    process.env.SHIPBRAIN_INCIDENT_WEBHOOK_URL ??
    (shipBrainApiUrl ? `${shipBrainApiUrl.replace(/\/$/, "")}/api/webhooks/incidents` : null) ??
    "https://12d4-2401-4900-1f29-7150-7c7f-a83c-c90b-7e2c.ngrok-free.app/api/webhooks/incidents";

  const headers = { "content-type": "application/json" };
  if (shipBrainApiKey) {
    headers["Authorization"] = `Bearer ${shipBrainApiKey}`;
  }

  const shipBrainResponse = await fetch(shipBrainWebhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      source: "cartlane-checkout",
      repo: payload.repo,
      environment: payload.environment,
      service: payload.service,
      severity: payload.severity,
      title: payload.title,
      logs: payload.logs,
      branch: payload.branch,
      commit: payload.commit,
      releaseVersion: payload.releaseVersion ?? releaseVersion,
      incidentId: dedupKey
    })
  }).catch((error) => ({
    ok: false,
    status: 0,
    json: async () => ({ error: error instanceof Error ? error.message : "ShipBrain webhook failed" })
  }));

  const shipBrainBody = await shipBrainResponse.json().catch(() => ({}));

  response.status(shipBrainResponse.ok ? 202 : (shipBrainResponse.status || 500)).json({
    dedupKey,
    shipBrainStatus: shipBrainResponse.status,
    shipBrainBody,
    pagerDutyStatus,
    providerAccepted: pagerDutyAccepted,
    body: pagerDutyBody
  });
}
