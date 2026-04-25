"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import GlobalSearch from "@/components/shared/GlobalSearch";

/**
 * Hero search bar that opens the GlobalSearch dropdown on focus/click.
 * Closes on outside click or ESC key.
 */
export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* Trigger input (visual) */}
      <button
        id="hero-search-trigger"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 h-12 pl-4 pr-4 rounded-xl border border-border bg-background/80 backdrop-blur-sm shadow-sm hover:border-primary/40 hover:shadow-md transition-all text-left group"
        aria-label="Open search"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Search className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
        <span className="text-sm text-muted-foreground flex-1">
          Search doctors, medicines, lab tests...
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      {/* Dropdown panel */}
      {open && (
        <>
          {/* Backdrop overlay (mobile) */}
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden" onClick={close} />

          <div
            role="dialog"
            aria-label="Search"
            className="absolute left-0 top-[calc(100%+8px)] z-50 w-full sm:w-[540px] rounded-2xl border border-border bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <GlobalSearch onClose={close} autoFocus />
          </div>
        </>
      )}

      {/* Global keyboard shortcut ⌘K / Ctrl+K */}
      <GlobalKeyboardShortcut onOpen={() => setOpen(true)} />
    </div>
  );
}

function GlobalKeyboardShortcut({ onOpen }: { onOpen: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpen();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onOpen]);
  return null;
}
