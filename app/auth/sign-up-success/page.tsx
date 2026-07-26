import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo1.png" alt="Catalogly" className="h-10 w-auto object-contain" />
          </div>
          <Card className="shadow-lg border-0 ring-1 ring-black/5 dark:ring-white/10">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="size-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                ¡Gracias por registrarte!
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Revisa tu correo para confirmar tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-center text-muted-foreground">
                Tu cuenta fue creada exitosamente. Por favor revisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
