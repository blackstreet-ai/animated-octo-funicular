"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col md:flex-row items-center justify-between py-8 md:py-6">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} AI Cinematic Conversion
          </p>
        </div>
        <nav className="mt-4 md:mt-0 flex flex-wrap justify-center gap-4 md:gap-6">
          <Link
            href="/about"
            className="text-sm text-text-secondary hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-text-secondary hover:text-primary"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-text-secondary hover:text-primary"
          >
            Terms
          </Link>
          <Link
            href="/contact"
            className="text-sm text-text-secondary hover:text-primary"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
