import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopNav } from "@/components/admin/admin-top-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <AdminSidebar />
      <SidebarInset className="min-h-svh bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.03),transparent_50%)]">
        <div className="flex-1 px-3 py-4 sm:px-5 sm:py-6 md:px-6 md:py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
            <AdminTopNav />
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
