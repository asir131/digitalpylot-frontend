import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Topbar } from "@/components/Topbar";
import { Suspense } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FFF9F5]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <div className="container-padded py-6">
          <div className="flex items-center justify-between">
            <MobileNav />
            {/* <div className="hidden md:block text-xs text-mist">Secure RBAC Workspace</div> */}
          </div>
        </div>
        <main className="container-padded pb-16">
          <Suspense fallback={<div className="h-12" />}>
            <Topbar />
          </Suspense>
          <div className="mt-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
