import test from "node:test";
import assert from "node:assert/strict";
import { publicMetadata, siteOrigin, robotsText } from "../lib/seo-metadata.ts";

test("public metadata uses the active production origin and correctly sized share image", () => {
  const metadata = publicMetadata("Tours", "Explore our tours", "/tours", "");
  assert.equal(metadata.alternates.canonical, "https://city2trip.vercel.app/tours");
  assert.equal(metadata.openGraph.images[0].width, 1200);
  assert.equal(metadata.openGraph.images[0].height, 630);
  assert.equal(metadata.twitter.images[0], metadata.openGraph.images[0].url);
  assert.equal(siteOrigin("https://gosavion.example/"), "https://gosavion.example");
  for (const domain of ["http://example.com", "https://user:pass@example.com", "https://example.com/path", "https://example.com?x=1", "bad"])
    assert.equal(siteOrigin(domain), "https://city2trip.vercel.app");
});

test("production robots includes the sitemap while preview deployments stay private", () => {
  assert.match(robotsText("", "production"), /Allow: \/\nDisallow: \/admin/);
  assert.match(robotsText("", "production"), /Sitemap: https:\/\/city2trip.vercel.app\/sitemap.xml/);
  assert.equal(robotsText("", "preview"), "User-agent: *\nDisallow: /\n");
  assert.equal(robotsText("", "development"), "User-agent: *\nDisallow: /\n");
});
