"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { NotificationInfo } from "@/types";

export function useNotifications(enabled = true) {
  const [notifications, setNotifications] = useState<NotificationInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    try {
      const response = await fetch("/api/notifications");
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  const markAsRead = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return;

    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    setNotifications((current) =>
      current.map((notification) =>
        ids.includes(notification.id)
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  useEffect(() => {
    async function loadNotifications() {
      await fetchNotifications();
    }

    void loadNotifications();
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
  };
}
