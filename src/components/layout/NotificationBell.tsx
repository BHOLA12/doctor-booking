"use client";

import Link from "next/link";
import { Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationBell() {
  const { notifications, loading, unreadCount, markAsRead } = useNotifications(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="icon" className="relative rounded-full" />}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-3 py-2">
          <p className="font-medium">Notifications</p>
          <p className="text-xs text-muted-foreground">Appointments and clinical updates</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-3 py-6 text-sm text-muted-foreground">No notifications yet.</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="cursor-pointer items-start"
              onClick={() => markAsRead([notification.id])}
            >
              <Link href={notification.link || "#"} className="w-full">
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${
                      notification.isRead ? "bg-muted-foreground/30" : "bg-primary"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
