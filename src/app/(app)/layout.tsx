import { AppSidebar } from "@/components/app-sidebar";
import { isLocalDevMode } from "@/lib/dev-mode";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar devMode={isLocalDevMode()} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
