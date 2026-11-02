// Run from the website directory. Uses the image tooling already installed with miniflare.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", { paths: [require.resolve("miniflare")] }));
const background = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
<rect width="1200" height="630" fill="#f7f9fc"/>
<path d="M770 0H1200V630H910L680 180Z" fill="#214878"/>
<path d="M748 0h8l-48 122h-8Z" fill="#c99a59"/>
<text x="144" y="100" font-family="Arial,sans-serif" font-size="46" font-weight="700" fill="#214878">GosaviOn</text>
<text x="148" y="128" font-family="Arial,sans-serif" font-size="16" letter-spacing="9" fill="#62738b">GROUP</text>
<text x="60" y="245" font-family="Arial,sans-serif" font-size="51" font-weight="700" fill="#172a43">Your journey.</text>
<text x="60" y="309" font-family="Arial,sans-serif" font-size="51" font-weight="700" fill="#214878">Our responsibility.</text>
<text x="60" y="365" font-family="Arial,sans-serif" font-size="24" fill="#53657b">Vehicle &amp; chauffeur rental</text>
<text x="60" y="570" font-family="Arial,sans-serif" font-size="20" fill="#214878">City travel · Outstation journeys · Hire a driver</text>
<rect x="60" y="594" width="80" height="4" fill="#1b9ec2"/>
</svg>`);
const logo = await sharp("public/images/gosavion-mark.png").resize(70, 80, { fit: "inside" }).png().toBuffer();
const car = await sharp("public/images/rental-vehicle-v2.png").resize(650, 320, { fit: "inside" }).png().toBuffer();
await sharp(background).composite([{ input: logo, left: 60, top: 56 }, { input: car, left: 535, top: 300 }])
  .png().toFile("public/images/gosavion-share.png");
console.log("Created public/images/gosavion-share.png (1200 × 630)");
