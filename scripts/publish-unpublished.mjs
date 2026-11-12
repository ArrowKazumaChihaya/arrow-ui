import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const workspaceDirectories = [
  "packages/ui-tokens",
  "packages/ui",
  "packages/ui-design-remix",
  "packages/ui-design-classic",
  "packages/eslint-plugin",
];

for (const directory of workspaceDirectories) {
  const manifest = JSON.parse(readFileSync(`${directory}/package.json`, "utf8"));

  if (manifest.private) continue;

  const packageVersion = `${manifest.name}@${manifest.version}`;
  const existing = spawnSync(
    "npm",
    ["view", packageVersion, "version", "--json", "--registry=https://registry.npmjs.org/"],
    { encoding: "utf8" },
  );

  if (existing.status === 0 && JSON.parse(existing.stdout.trim()) === manifest.version) {
    console.log(`Skipping ${packageVersion}: already published`);
    continue;
  }

  console.log(`Publishing ${packageVersion}`);
  const published = spawnSync(
    "npm",
    ["publish", "--workspace", manifest.name, "--access", "public"],
    { stdio: "inherit" },
  );

  if (published.status !== 0) process.exit(published.status ?? 1);
}
