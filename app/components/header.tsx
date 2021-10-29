import clsx from "clsx";
import * as React from "react";
import { NavLink } from "remix";

import logoUrl from "../../public/favicon.png";

const Header: React.VFC = () => (
  <header className="flex items-center p-1 bg-primary">
    <NavLink to="/" className="flex items-center mr-2.5 flex-shrink-0">
      <img height={20} width={20} src={logoUrl} alt="remix logo" />
      <h1 className="ml-1 font-bold">Hacker Remix</h1>
    </NavLink>
    <nav className="flex justify-between w-full">
      <ul className="flex items-center">
        <li>
          <NavLink
            className={({ isActive }) =>
              clsx("px-2.5", isActive ? "text-white" : "hover:text-white")
            }
            to="/newest"
          >
            new
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              clsx("px-2.5", isActive ? "text-white" : "hover:text-white")
            }
            to="/front"
          >
            past
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              clsx("px-2.5", isActive ? "text-white" : "hover:text-white")
            }
            to="/ask"
          >
            ask
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              clsx("px-2.5", isActive ? "text-white" : "hover:text-white")
            }
            to="/show"
          >
            show
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              clsx("px-2.5", isActive ? "text-white" : "hover:text-white")
            }
            to="/jobs"
          >
            jobs
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              clsx("px-2.5", isActive ? "text-white" : "hover:text-white")
            }
            to="/submit"
          >
            submit
          </NavLink>
        </li>
      </ul>
      <div>
        <NavLink
          className={({ isActive }) =>
            clsx("px-2.5", isActive ? "text-white" : "hover:text-white")
          }
          to="/login"
        >
          login
        </NavLink>
      </div>
    </nav>
  </header>
);

export { Header };
