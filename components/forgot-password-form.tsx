"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { AlertCircle, Loader2, Mail, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ha ocurrido un error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo1.png" alt="Catalogly" className="h-10 w-auto object-contain" />
      </div>
      {success ? (
        <Card className="shadow-lg border-0 ring-1 ring-black/5 dark:ring-white/10">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="size-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Revisa tu correo</CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Te enviamos las instrucciones para restablecer tu contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-center text-muted-foreground">
              Si creaste tu cuenta con correo y contraseña, recibirás un email con los pasos para restablecer tu contraseña.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg border-0 ring-1 ring-black/5 dark:ring-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Restablecer contraseña</CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 pl-9"
                    />
                  </div>
                </div>
                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <Button type="submit" className="w-full h-10 font-medium" disabled={isLoading}>
                  {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
                  {isLoading ? "Enviando..." : "Enviar correo de restablecimiento"}
                </Button>
              </div>
              <div className="mt-5 text-center text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary font-medium hover:underline underline-offset-4"
                >
                  Iniciar sesión
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
