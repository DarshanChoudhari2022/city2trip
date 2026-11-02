import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { readPublicContent, readSettings } from "@/lib/repository";
import DetailPage from "@/components/detail-page";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = (await readPublicContent()).find(
    (i) => i.slug === slug && i.kind === "service",
  );
  return pageMetadata(
    item?.title || "Service not found",
    item?.summary || "Explore current City2Trip services.",
    "/services/" + slug,
  );
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = (await readPublicContent()).find(
    (i) => i.slug === slug && i.kind === "service",
  );
  if (!item) notFound();
  return <DetailPage item={item} settings={await readSettings()} />;
}
