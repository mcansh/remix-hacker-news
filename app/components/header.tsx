import { Link, NavLink } from "@remix-run/react";
import clsx from "clsx";

import logoUrl from "~/logo.png";

const links = [
	{ to: "/newest", text: "new" },
	{ to: "/front", text: "past" },
	{ to: "/ask", text: "ask" },
	{ to: "/show", text: "show" },
	{ to: "/jobs", text: "jobs" },
	{ to: "/submit", text: "submit" },
];

export function Header() {
	return (
		<header className="flex flex-col items-center bg-primary p-1 text-black sm:flex-row">
			<Link
				to="/"
				className="mb-2.5 mr-2.5 flex flex-shrink-0 items-center sm:mb-0"
			>
				<img height={20} width={20} src={logoUrl} alt="remix logo" />
				<h1 className="ml-1 font-bold">Hacker Remix</h1>
			</Link>
			<nav className="flex w-full justify-between">
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
