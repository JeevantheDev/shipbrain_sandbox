import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const releaseVersion = process.env.SHIPBRAIN_RELEASE_TAG ?? process.env.RELEASE_VERSION ?? "cart-v2026.05.24";

async function main() {
  await fs.mkdir("dist", { recursive: true });
  await fs.mkdir("dist/api", { recursive: true });

  // 1. Copy and patch index.html
  let html = await fs.readFile("index.html", "utf8");
  html = html.replace(/let releaseVersion = "[^"]*";/, `let releaseVersion = "${releaseVersion}";`);
  await fs.writeFile("dist/index.html", html, "utf8");

  // 2. Create static api/release JSON
  const releaseJson = {
    releaseVersion,
    repo: "JeevantheDev/shipbrain_sandbox",
    mode: "mock-cart-checkout"
  };
  await fs.writeFile("dist/api/release", JSON.stringify(releaseJson, null, 2), "utf8");

  // 3. Copy other API files if they exist
  try {
    const files = await fs.readdir("api");
    for (const file of files) {
      if (file !== "release.js") {
        await fs.copyFile(path.join("api", file), path.join("dist", "api", file));
      }
    }
  } catch (err) {
    // Ignore if api dir doesn't exist
  }

  console.log(`Build completed successfully. Release version: ${releaseVersion}`);
}

main().catch(console.error);
