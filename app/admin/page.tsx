import Link from "next/link";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { requireRole } from "@/lib/auth";
import {
  approveSellerRequest,
  rejectSellerRequest,
} from "@/app/actions/seller-requests";
import { getPendingSellerRequests } from "@/lib/seller-requests";

async function AdminContent() {
  const profile = await requireRole("admin");
  const pendingRequests = await getPendingSellerRequests();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Admin access granted</p>
          <Badge className="uppercase">{profile.role}</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Admin dashboard
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          This route is protected on the server and only users with the `admin`
          role can reach it.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/protected">Back to protected area</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/seller">Open seller panel</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User management</CardTitle>
            <CardDescription>
              Promote users to `seller` or `admin` from Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Suggested next step: build a server action or API route to update
            `public.profiles.role` safely.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Catalog oversight</CardTitle>
            <CardDescription>
              Review listings, inventory status, and seller activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Admins can share catalog tooling with sellers while keeping extra
            moderation controls here.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform settings</CardTitle>
            <CardDescription>
              Reserve this space for global business rules and reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Because the page is protected server-side, sensitive data can be
            fetched directly in this route.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seller requests</CardTitle>
          <CardDescription>
            Review pending requests from regular users and approve or reject
            them.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {pendingRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              There are no pending seller requests right now.
            </p>
          ) : (
            pendingRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-xl border p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">
                    {request.user_email ?? request.user_id}
                  </p>
                  <Badge variant="secondary" className="uppercase">
                    {request.status}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Requested on {new Date(request.created_at).toLocaleString()}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {request.notes || "No note was provided by the user."}
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <form action={approveSellerRequest} className="flex flex-col gap-3">
                    <input type="hidden" name="requestId" value={request.id} />
                    <Textarea
                      name="adminNotes"
                      placeholder="Optional approval note"
                      rows={4}
                    />
                    <Button type="submit">Approve and promote to seller</Button>
                  </form>
                  <form action={rejectSellerRequest} className="flex flex-col gap-3">
                    <input type="hidden" name="requestId" value={request.id} />
                    <Textarea
                      name="adminNotes"
                      placeholder="Optional rejection note"
                      rows={4}
                    />
                    <Button type="submit" variant="destructive">
                      Reject request
                    </Button>
                  </form>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AdminSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="mt-4 h-10 w-56 rounded bg-muted" />
        <div className="mt-3 h-4 w-full max-w-2xl rounded bg-muted" />
        <div className="mt-2 h-4 w-3/4 max-w-xl rounded bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-48 rounded-xl border bg-card" />
        <div className="h-48 rounded-xl border bg-card" />
        <div className="h-48 rounded-xl border bg-card" />
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        <Suspense fallback={<AdminSkeleton />}>
          <AdminContent />
        </Suspense>
      </div>
    </main>
  );
}
