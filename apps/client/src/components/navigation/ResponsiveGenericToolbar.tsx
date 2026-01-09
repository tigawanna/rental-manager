import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { Link } from "@tanstack/react-router";
import { MapPinHouse } from "lucide-react";

interface ResponsiveGenericToolbarProps {
children: React.ReactNode
}

export function ResponsiveGenericToolbar({children}:ResponsiveGenericToolbarProps){
return (
  <div className="drawer" data-test="sidebar-drawer">
    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content flex h-full min-h-screen flex-col bg-base-100">
      {/* Navbar */}
      <div className="navbar sticky top-0 z-10 bg-base-100/80 backdrop-blur-md border-b border-base-300 md:hidden">
        <div className="flex-none">
          <label
            htmlFor="my-drawer-3"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
            data-test="homepage-side-drawer-toggle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-6 w-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
        <div className="flex-1">
          <Link
            to="/"
            className="flex items-center gap-2 px-2 text-xl font-bold text-base-content hover:text-primary"
          >
            <MapPinHouse className="size-5" />
            My Rentals
          </Link>
        </div>
        <div className="flex-none">
          <ThemeToggle />
        </div>
      </div>

      <div
        data-test="homepage-toolbar"
        className="navbar sticky top-0 z-10 hidden bg-base-100/80 backdrop-blur-md border-b border-base-300 md:flex"
      >
        <div className="flex-1">
          <Link
            to="/"
            data-test="homepage-home-link"
            className="btn btn-ghost text-xl font-bold normal-case text-base-content hover:text-primary"
          >
            <MapPinHouse className="size-6" />
            My Rentals
          </Link>
        </div>
        <div className="flex-none">
          <ThemeToggle />
        </div>
      </div>
      {/* Page content here */}
      {children}
    </div>
    <div className="drawer-side z-50">
      <label
        htmlFor="my-drawer-3"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <ul
        data-test="homepage-sidebar"
        className="menu min-h-full w-80 bg-base-100 border-r border-base-300 p-4"
      >
        {/* Sidebar content here */}
        <li className="menu-title">
          <Link
            to="/"
            data-test="sidebar-homepage-home-link"
            className="flex items-center justify-center gap-2 p-4 text-xl font-bold hover:text-primary"
          >
            <MapPinHouse className="size-8" />
            <span>My Rentals</span>
          </Link>
        </li>

        <li className="mt-auto">
          <ThemeToggle />
        </li>
      </ul>
    </div>
  </div>
);
}
