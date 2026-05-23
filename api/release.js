export default function handler(request, response) {
  response.status(200).json({
    releaseVersion: process.env.SHIPBRAIN_RELEASE_TAG ?? process.env.RELEASE_VERSION ?? "cart-v2026.05.24",
    repo: "JeevantheDev/shipbrain_sandbox",
    mode: "mock-cart-checkout"
  });
}
