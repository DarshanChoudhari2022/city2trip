import sharp from "sharp";
// Deterministic extraction of the supplied mark and the vehicle photograph.
const source = process.argv[2];
if (source) {
  const { data, info } = await sharp(source)
    .extract({ left: 230, top: 150, width: 165, height: 145 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const max = Math.max(data[i], data[i + 1], data[i + 2]),
      min = Math.min(data[i], data[i + 1], data[i + 2]);
    if (max > 110 && (max - min) / max < 0.31) data[i + 3] = 0;
  }
  await sharp(data, { raw: info })
    .trim()
    .png()
    .toFile("public/images/gosavion-mark.png");
}
// The cleaned vehicle cutout is retained separately as rental-vehicle-v2.png.
