import test from "node:test";
import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:5173";
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(([tag]) =>
  Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value])));

test("all published pages have distinct metadata, valid images, links and canonical URLs", async () => {
  const sitemap = await fetch(base + "/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => new URL(url));
  assert.ok(urls.length >= 6, "The sitemap must include the main public pages");
  const titles = new Set(), descriptions = new Set(), links = new Set();
  for (const url of urls) {
    const path = url.pathname;
    assert.ok(!path.startsWith("/admin") && !path.startsWith("/api/"));
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    const meta = tags(html, "meta");
    const description = meta.find(t => t.name === "description")?.content;
    assert.ok(title && !titles.has(title), "Distinct title: " + path);
    assert.ok(description && !descriptions.has(description), "Distinct description: " + path);
    titles.add(title); descriptions.add(description);
    assert.equal(tags(html, "link").find(t => t.rel === "canonical")?.href, url.href, path);
    for (const key of ["og:title", "og:description", "og:url", "og:image"])
      assert.ok(meta.find(t => t.property === key)?.content, key + ": " + path);
    assert.equal(meta.find(t => t.name === "twitter:card")?.content, "summary_large_image");
    assert.equal(meta.find(t => t.property === "og:image:width")?.content, "1200");
    assert.equal(meta.find(t => t.property === "og:image:height")?.content, "630");
    for (const img of tags(html, "img")) assert.ok(Object.hasOwn(img, "alt"), "Image alt: " + path);
    for (const a of tags(html, "a")) if (a.href?.startsWith("/") && !a.href.startsWith("//")) links.add(a.href);
  }
  for (const path of links) assert.equal((await fetch(base + path)).status, 200, "Internal link: " + path);
  const image = await fetch(base + "/images/gosavion-share.png");
  assert.equal(image.status, 200);
  const png = Buffer.from(await image.arrayBuffer());
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  console.log(`Audited ${urls.length} published pages and ${links.size} internal destinations`);
});

test("missing pages return HTTP 404; private admin requests are protected", async () => {
  for (const path of ["/missing-launch-audit-page", "/services/missing-launch-audit-service", "/tours/missing-launch-audit-tour"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 404, path);
    assert.match(await response.text(), /Back to home/);
  }
  const admin = await fetch(base + "/admin");
  assert.match(await admin.text(), /noindex/);
  assert.equal((await fetch(base + "/api/admin/bookings")).status, 401);
  const robots = await fetch(base + "/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Disallow: \/admin/);
});
