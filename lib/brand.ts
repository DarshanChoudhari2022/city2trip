/** Keep previously saved content consistent with the new business identity. */
export function brandContent<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value)
      .replaceAll("City2Trip", "GosaviOn Group")
      .replaceAll("/images/hero.webp", "/images/vehicle.webp"),
  );
}
