import { hasEnvVars } from "@/lib/utils";
import { getCurrentUserProfile } from "@/lib/auth";
import { NavbarClient } from "./NavbarClient";
import { Suspense } from "react";

export default async function Navbar() {
  const envVarsAvailable = Boolean(hasEnvVars);
  const user = envVarsAvailable ? await getCurrentUserProfile() : null;

  return (
    <NavbarClient user={user} hasEnvVars={envVarsAvailable} />
  )
}
