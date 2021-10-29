import * as React from "react";
import { Link } from "remix";

import logoUrl from "../../public/favicon.png";

const Header: React.VFC = () => (
  <header className="flex items-center p-1 bg-primary">
    <Link to="/" className="flex items-center mr-2.5 flex-shrink-0">
      <img height={20} width={20} src={logoUrl} alt="remix logo" />
      <h1 className="ml-1 font-bold">Hacker Remix</h1>
    </Link>
    <nav className="flex justify-between w-full">
      <ul className="flex items-center">
        <li>
          <Link className="px-2.5 hover:text-white" to="/new">
            new
          </Link>
        </li>
        <li>
          <Link className="px-2.5 hover:text-white" to="/past">
            past
          </Link>
        </li>
        <li>
          <Link className="px-2.5 hover:text-white" to="/comments">
            comments
          </Link>
        </li>
        <li>
          <Link className="px-2.5 hover:text-white" to="/ask">
            ask
          </Link>
        </li>
        <li>
          <Link className="px-2.5 hover:text-white" to="/show">
            show
          </Link>
        </li>
        <li>
          <Link className="px-2.5 hover:text-white" to="/jobs">
            jobs
          </Link>
        </li>
        <li>
          <Link className="px-2.5 hover:text-white" to="/submit">
            submit
          </Link>
        </li>
      </ul>
      <div>
        <Link className="px-2.5 hover:text-white" to="/login">
          login
        </Link>
      </div>
    </nav>
  </header>
);

export { Header };
