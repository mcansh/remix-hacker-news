import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

test("root document includes noindex, nofollow robots meta and a canonical", () => {
  const source = readFileSync(join(rootDir, "app/root.tsx"), "utf8");
  assert.match(source, /<meta name="robots" content="noindex, nofollow" \/>/);
  assert.match(source, /<link rel="canonical" href=\{canonicalUrl\} \/>/);
  assert.match(source, /title: "Remix Hacker News"/);
  assert.match(
    source,
    /name: "description", content: "Hacker News made with Remix.run"/,
  );
});

test("HTML document handler sends X-Robots-Tag", () => {
  const source = readFileSync(join(rootDir, "app/entry.server.tsx"), "utf8");
  assert.match(
    source,
    /responseHeaders\.set\("X-Robots-Tag", "noindex, nofollow"\)/,
  );
});

test("does not add a robots.txt Disallow", () => {
  assert.equal(existsSync(join(rootDir, "public/robots.txt")), false);
});
