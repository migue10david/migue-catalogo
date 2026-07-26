

import * as React from "react"
import {
  Users,
  Home,
  File,
  MessageSquareMore,
} from "lucide-react"
import Link from "next/link"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

const navGroups = [
  {
    label: "Dashboards",
    items: [
      {
        title: "Vista general",
        url: "/admin",
        icon: Home,
      },
      {
        title: "Usuarios",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "Catálogos",
        url: "/admin/catalogs",
        icon: File,
      },
      {
        title: "Solicitudes",
        url: "/admin/requests",
        icon: MessageSquareMore,
      },
    ],
  },
]

type AppSidebarUser = {
  name: string
  email: string
  avatar: string
}

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: AppSidebarUser }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Catalogly</span>
                  <span className="truncate text-xs">Panel Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}