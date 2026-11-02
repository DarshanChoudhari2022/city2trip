import { env } from "@/lib/platform-env";
import { isAdmin } from "@/lib/auth";
import { readAll, readSettings } from "@/lib/repository";
import AdminLogin from "@/components/admin-login";
import AdminEditor from "@/components/admin-editor";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Content studio",
  robots: { index: false, follow: false },
};
export default async function Admin() {
  if (!(await isAdmin())) return <AdminLogin />;
  const [items, settings] = await Promise.all([readAll(), readSettings()]);
  return (
    <AdminEditor
      initialItems={items}
      initialSettings={settings}
      enquiriesEnabled={!!env.WEB3FORMS_ACCESS_KEY}
    />
  );
}
