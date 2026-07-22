import { AdminPanel } from "@/components/admin/admin-panel";

// Kept out of search engines and out of the site's own nav (no link to
// this route exists anywhere) — the URL itself is the only way in, plus
// the password.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPanel />;
}
