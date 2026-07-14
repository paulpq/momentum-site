import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const client = resolve(dist, "client");
const server = resolve(dist, "server");

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });
await mkdir(resolve(client, "assets"), { recursive: true });
await mkdir(resolve(client, "assets/icons"), { recursive: true });
await writeFile(resolve(client, ".nojekyll"), "");

for (const asset of ["index.html", "gallery.html", "styles.css", "script.js", "favicon.png", "favicon-32.png", "apple-touch-icon.png"]) {
  await cp(resolve(root, asset), resolve(client, asset));
}
await cp(resolve(root, "public/og-sunday.png"), resolve(client, "og-sunday.png"));
await cp(resolve(root, "public/assets/momentum-logo.webp"), resolve(client, "assets/momentum-logo.webp"));
for (const icon of ["telegram.png", "instagram.png"]) {
  await cp(resolve(root, `public/assets/icons/${icon}`), resolve(client, `assets/icons/${icon}`));
}
for (const directory of ["gallery-thumbs", "gallery-all"]) {
  await cp(resolve(root, `public/assets/${directory}`), resolve(client, `assets/${directory}`), { recursive: true });
}

await writeFile(resolve(server, "index.js"), `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
`);

console.log("Momentum site built successfully.");
