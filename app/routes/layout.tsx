import { Outlet } from "react-router";
import { Header } from "~/components/header";

export default function Layout() {
  return (
    <div className="text-base text-default">
      <div className="mx-auto w-full bg-bg sm:mt-2.5 md:w-[85%] md:min-w-[796px]">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
