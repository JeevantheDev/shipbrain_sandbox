import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function createDraftPR() {
  try {
    const response = await octokit.pulls.create({
      owner: "your-org-or-username",
      repo: "your-repo-name",
      title: "Draft: Production Release from develop to main",
      head: "develop",
      base: "main",
      body: "This draft pull request prepares the production release by merging changes from the develop branch into the main branch. Please review the changes and finalize the release when ready.",
      draft: true
    });
    console.log(`Draft PR created: ${response.data.html_url}`);
  } catch (error) {
    console.error("Failed to create draft PR", error);
  }
}

createDraftPR();
