import { Outlet } from "@remix-run/react";
import { Header } from "~/components/header";

export default function Layout() {
  return (
    <>
      <div className="bg-bg mx-auto w-full sm:mt-2.5 md:w-[85%] md:min-w-[796px]">
        <Header />
        <Outlet />
      </div>
    </>
  );
}
