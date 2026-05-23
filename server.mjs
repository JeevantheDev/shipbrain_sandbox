import http from "node:http";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnvFile(path.join(__dirname, ".env"));

const port = Number(process.env.PORT ?? 5174);
const routingKey = process.env.PAGERDUTY_ROUTING_KEY;
const releaseVersion = process.env.SHIPBRAIN_RELEASE_TAG ?? process.env.RELEASE_VERSION ?? "cart-v2026.05.22";

function loadEnvFile(filePath) {
  try {
    const envText = fsSync.readFileSync(filePath, "utf8");
    for (const line of envText.split(/\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env is optional; explicit shell env vars still work.
  }
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function sendJson(response, status, body) {
  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(body, null, 2));
}

const server = http.createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/") {
    const html = await fs.readFile(path.join(__dirname, "index.html"), "utf8");
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end(html);
    return;
  }

  if (request.method === "GET" && request.url === "/api/release") {
    sendJson(response, 200, {
      releaseVersion,
      repo: "JeevantheDev/shipbrain_sandbox",
      mode: "mock-cart-checkout"
    });
    return;
  }

  if (request.method === "POST" && request.url === "/api/trigger-incident") {
    if (!routingKey) {
      sendJson(response, 500, {
        error: "Incident provider routing key is required. Configure the sandbox alert provider key in the runtime environment."
      });
      return;
    }

    const payload = JSON.parse(await readBody(request));
    if (payload.shouldTriggerIncident === false) {
      sendJson(response, 200, {
        outcome: "checkout_succeeded",
        releaseVersion: payload.releaseVersion ?? releaseVersion,
        headingColor: payload.headingColor ?? "not provided",
        message: "No incident was opened because the checkout heading is not green."
      });
      return;
    }

    const dedupKey = `shipbrain-sandbox-${payload.service ?? "checkout-api"}-${payload.environment ?? "sandbox"}`;
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

    const pagerDutyResponse = await fetch("https://events.pagerduty.com/v2/enqueue", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(pagerDutyPayload)
    });
    const body = await pagerDutyResponse.json().catch(() => ({}));
    const shipBrainWebhookUrl =
      process.env.SHIPBRAIN_INCIDENT_WEBHOOK_URL ??
      "https://12d4-2401-4900-1f29-7150-7c7f-a83c-c90b-7e2c.ngrok-free.app/api/webhooks/incidents";
    const shipBrainResponse = await fetch(shipBrainWebhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
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
    }).catch((error) => ({ ok: false, status: 0, json: async () => ({ error: error instanceof Error ? error.message : "ShipBrain webhook failed" }) }));
    const shipBrainBody = await shipBrainResponse.json().catch(() => ({}));
    sendJson(response, pagerDutyResponse.ok ? 202 : pagerDutyResponse.status, {
      alertProviderStatus: pagerDutyResponse.status,
      dedupKey,
      providerAccepted: pagerDutyResponse.ok,
      body
    });
    return;
  }

  sendJson(response, 404, { error: "Not found" });
});

server.listen(port, () => {
  console.log(`ShipBrain sandbox app running at http://localhost:${port}`);
});
