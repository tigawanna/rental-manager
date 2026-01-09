import { Link, useRouter, useLocation } from "@tanstack/react-router";
import { Github, Mail, MapPinHouse, Twitter } from "lucide-react";
import { useReducer } from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { pathname } = useLocation();

  return (
    <footer className="footer footer-center bg-base-200 text-base-content p-10">
      <aside>
        <MapPinHouse className="size-12 text-primary" />
        <p className="font-bold text-lg">
          My Rentals
          <br />
          Property Management Made Simple
        </p>
        <p className="text-sm text-base-content/70">
          Copyright © {currentYear} - All rights reserved
        </p>
      </aside>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <Link to="/" className="link link-hover">
            Home
          </Link>
          <Link to="/dashboard" className="link link-hover">
            Dashboard
          </Link>
          <Link to="/profile" className="link link-hover">
            Profile
          </Link>
          <Link
            to="/auth"
            search={{
              returnTo: pathname,
            }}
            className="link link-hover">
            Sign In
          </Link>
        </div>
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-square btn-sm">
            <Github className="size-5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-square btn-sm">
            <Twitter className="size-5" />
          </a>
          <a href="mailto:support@myrentals.com" className="btn btn-ghost btn-square btn-sm">
            <Mail className="size-5" />
          </a>
        </div>
      </nav>
    </footer>
  );
}
