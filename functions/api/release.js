async function getReleaseVersion(request, env) {
  try {
    const url = new URL(request.url);
    url.pathname = "/release.json";
    const res = await env.ASSETS.fetch(url.toString());
    if (res.ok) {
      const data = await res.json();
      if (data && data.releaseVersion) {
        return data.releaseVersion;
      }
    }
  } catch (err) {
    // Ignore and fallback
  }
  return env.SHIPBRAIN_RELEASE_TAG ?? env.RELEASE_VERSION ?? "release-pending";
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const releaseVersion = await getReleaseVersion(request, env);
  return new Response(JSON.stringify({
    releaseVersion,
    repo: "JeevantheDev/shipbrain_sandbox",
    mode: "mock-cart-checkout"
  }, null, 2), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
}
