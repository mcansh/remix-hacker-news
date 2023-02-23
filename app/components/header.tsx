import clsx from "clsx";
import { Link, NavLink } from "@remix-run/react";

import logoUrl from "~/logo.png";

let links = [
  { to: "/newest", text: "new" },
  { to: "/front", text: "past" },
  { to: "/ask", text: "ask" },
  { to: "/show", text: "show" },
  { to: "/jobs", text: "jobs" },
  { to: "/submit", text: "submit" },
];

export function Header() {
  return (
    <header className="flex flex-col items-center p-1 sm:flex-row bg-primary text-black">
      <Link
        to="/"
        className="flex items-center mb-2.5 sm:mb-0 mr-2.5 flex-shrink-0"
      >
        <img height={20} width={20} src={logoUrl} alt="remix logo" />
        <h1 className="ml-1 font-bold">Hacker Remix</h1>
      </Link>
      <nav className="flex justify-between w-full">
        <ul className="flex items-center divide-x">
          {links.map((link) => {
            return (
              <li key={link.to}>
                <NavLink
                  className={({ isActive }) =>
                    clsx("px-2.5", isActive ? "text-white" : "")
                  }
                  to={link.to}
                >
                  {link.text}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div>
          <NavLink
            className={({ isActive }) =>
              clsx("px-2.5", isActive ? "text-white" : "")
            }
            to="/login"
          >
            login
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
