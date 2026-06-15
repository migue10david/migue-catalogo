import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { submitSellerRequest } from "@/app/actions/seller-requests";
import { getLatestSellerRequestForUser } from "@/lib/seller-requests";

function getRoleDescription(role: "admin" | "seller" | "user") {
  if (role === "admin") {
    return "You can manage the platform, sellers, and regular users.";
  }

  if (role === "seller") {
    return "You can manage your catalog and seller-specific flows.";
  }

  return "You have the default authenticated user permissions.";
}

async function ProtectedContent() {
  const profile = await requireUser();
  const latestSellerRequest =
    profile.role === "user"
      ? await getLatestSellerRequestForUser(profile.id)
      : null;

  return (
    <div className="flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Role access</h2>
        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current role</span>
            <Badge className="uppercase">{profile.role}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {getRoleDescription(profile.role)}
          </p>
          {!profile.isRoleConfigured && (
            <p className="text-sm text-amber-600">
              The `profiles` table is not available yet. Run the SQL migration
              in Supabase to persist real roles.
            </p>
          )}
        </div>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Available panels</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(profile.role === "admin" || profile.role === "seller") && (
            <Card>
              <CardHeader>
                <CardTitle>Seller panel</CardTitle>
                <CardDescription>
                  Products, inventory, and seller operations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/seller">Open seller panel</Link>
                </Button>
              </CardContent>
            </Card>
          )}
          {profile.role === "admin" && (
            <Card>
              <CardHeader>
                <CardTitle>Admin panel</CardTitle>
                <CardDescription>
                  User roles, platform configuration, and oversight.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/admin">Open admin panel</Link>
                </Button>
              </CardContent>
            </Card>
          )}
          {profile.role === "user" && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>No elevated panels yet</CardTitle>
                <CardDescription>
                  Your account is authenticated, but it does not have `admin` or
                  `seller` access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You can request seller access below and an admin can approve
                  it from the admin panel.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {profile.role === "user" && (
        <div>
          <h2 className="font-bold text-2xl mb-4">Seller subscription</h2>
          <Card>
            <CardHeader>
              <CardTitle>Request seller access</CardTitle>
              <CardDescription>
                Send a request and an admin can review it and promote your
                account to `seller`.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {latestSellerRequest ? (
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Latest request
                    </span>
                    <Badge
                      variant={
                        latestSellerRequest.status === "approved"
                          ? "default"
                          : latestSellerRequest.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                      className="uppercase"
                    >
                      {latestSellerRequest.status}
                    </Badge>
                  </div>
                  {latestSellerRequest.notes && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Your note:
                      </span>{" "}
                      {latestSellerRequest.notes}
                    </p>
                  )}
                  {latestSellerRequest.admin_notes && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Admin note:
                      </span>{" "}
                      {latestSellerRequest.admin_notes}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  You have not submitted any seller request yet.
                </p>
              )}

              {latestSellerRequest?.status === "pending" ? (
                <p className="text-sm text-muted-foreground">
                  Your request is pending review. An admin will approve or
                  reject it from the admin panel.
                </p>
              ) : (
                <form action={submitSellerRequest} className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="seller-request-notes"
                      className="text-sm font-medium"
                    >
                      Why do you want to become a seller?
                    </label>
                    <Textarea
                      id="seller-request-notes"
                      name="notes"
                      placeholder="Tell the admin about your store, products, or business plan."
                      rows={5}
                    />
                  </div>
                  <div>
                    <Button type="submit">Submit seller request</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}

function ProtectedSkeleton() {
  return (
    <div className="flex flex-col gap-12">
      <div className="h-12 w-full rounded-md bg-muted" />
      <div className="rounded-lg border p-4">
        <div className="h-7 w-48 rounded bg-muted" />
        <div className="mt-4 h-24 w-full rounded bg-muted" />
      </div>
      <div className="rounded-lg border p-4">
        <div className="h-7 w-40 rounded bg-muted" />
        <div className="mt-4 h-20 w-full rounded bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-40 rounded-xl border bg-card" />
        <div className="h-40 rounded-xl border bg-card" />
      </div>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <Suspense fallback={<ProtectedSkeleton />}>
      <ProtectedContent />
    </Suspense>
  );
}
