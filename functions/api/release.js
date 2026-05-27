export async function onRequestGet(context) {
  const { env } = context;
  const releaseVersion = env.SHIPBRAIN_RELEASE_TAG ?? env.RELEASE_VERSION ?? "cart-v2026.05.24";
  return new Response(JSON.stringify({
    releaseVersion,
    repo: "JeevantheDev/shipbrain_sandbox",
    mode: "mock-cart-checkout",
    envKeys: Object.keys(env),
    apiUrl: env.SHIPBRAIN_API_URL ?? null,
    webhookUrl: env.SHIPBRAIN_INCIDENT_WEBHOOK_URL ?? null
  }, null, 2), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
}
