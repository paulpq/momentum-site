import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const client = resolve(dist, "client");
const server = resolve(dist, "server");

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const asset of ["index.html", "gallery.html", "styles.css", "script.js", "og-sunday.png"]) {
  await cp(resolve(root, asset), resolve(client, asset));
}
await cp(resolve(root, "public/assets"), resolve(client, "assets"), { recursive: true });

await writeFile(resolve(server, "index.js"), `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
`);

console.log("Momentum site built successfully.");
