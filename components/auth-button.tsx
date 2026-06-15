import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";
import { Badge } from "./ui/badge";
import { getCurrentUserProfile } from "@/lib/auth";

export async function AuthButton() {
  const user = await getCurrentUserProfile();

  return user ? (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span>Hey, {user.email}!</span>
        <Badge variant="secondary" className="uppercase">
          {user.role}
        </Badge>
      </div>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
